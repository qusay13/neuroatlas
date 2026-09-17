"""Run inside Blender after importing brain.original.glb into a separate scene.
Preserves source surface positions; added pathways and right hemisphere are schematic.
"""
import bpy
import bmesh
import math
from mathutils import Matrix, Vector

scene = bpy.data.scenes.new('Brain Enhanced')
bpy.context.window.scene = scene
bpy.ops.import_scene.gltf(filepath='/home/qusay/Desktop/3D/artifacts/brain/brain.original.glb')
bpy.context.view_layer.update()
meshes = [o for o in scene.objects if o.type == 'MESH']
root = bpy.data.objects.new('Brain_Enhanced_Educational', None)
scene.collection.objects.link(root)
root.scale = (100, 100, 100)
root['anatomical_status'] = 'Source left hemisphere; mirrored right; illustrative white matter, not tractography'
mat = bpy.data.materials.new('Brain Tissue Enhanced')
mat.use_nodes = True
bsdf = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
bsdf.inputs['Base Color'].default_value = (0.65, 0.48, 0.37, 1)
bsdf.inputs['Roughness'].default_value = 0.7
mat.diffuse_color = (0.65, 0.48, 0.37, 1)
left = bpy.data.collections.new('01 Source hemisphere')
right = bpy.data.collections.new('02 Mirrored hemisphere - illustrative')
tracts = bpy.data.collections.new('03 White matter - schematic, not DTI')
for c in (left, right, tracts):
    scene.collection.children.link(c)
for o in meshes:
    world = o.matrix_world.copy()
    o.data.transform(Matrix.Scale(0.01, 4) @ world)
    o.parent = root
    o.matrix_parent_inverse = Matrix.Identity(4)
    o.matrix_basis = Matrix.Identity(4)
    for c in list(o.users_collection):
        c.objects.unlink(o)
    left.objects.link(o)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.00001)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(o.data)
    bm.free()
    if o.data.has_custom_normals:
        with bpy.context.temp_override(object=o, active_object=o):
            bpy.ops.mesh.customdata_custom_splitnormals_clear()
    for uv in list(o.data.uv_layers):
        o.data.uv_layers.remove(uv)
    for p in o.data.polygons:
        p.use_smooth = True
    o.data.materials.clear()
    o.data.materials.append(mat)
    o['hemisphere'] = 'source'
    duplicate = o.copy()
    duplicate.data = o.data.copy()
    duplicate.name = o.name + '__mirrored'
    right.objects.link(duplicate)
    for v in duplicate.data.vertices:
        v.co.x = 6.4 - v.co.x
    bm = bmesh.new()
    bm.from_mesh(duplicate.data)
    bmesh.ops.reverse_faces(bm, faces=list(bm.faces))
    bm.to_mesh(duplicate.data)
    bm.free()
    duplicate['hemisphere'] = 'mirrored'
    duplicate['anatomical_status'] = 'Symmetric reconstruction, not measured right anatomy'

# Bundles follow gross regional relationships only. Coordinates are source model units.
paths = [
    ('Arcuate fasciculus', [( -25,32,42),(-29,15,52),(-30,-7,51),(-29,-24,41),(-31,-21,29),(-33,-5,24)], (0.08,0.48,0.65,1)),
    ('Cingulum', [(-7,36,36),(-8,34,48),(-9,15,55),(-10,-8,53),(-11,-24,41),(-13,-20,25),(-14,-4,19)], (0.17,0.58,0.32,1)),
    ('Inferior longitudinal fasciculus', [(-19,24,14),(-27,8,14),(-29,-15,17),(-24,-34,22),(-17,-45,26)], (0.64,0.27,0.52,1)),
    ('Uncinate fasciculus', [(-16,42,26),(-21,29,23),(-23,18,17),(-20,22,12),(-18,30,12)], (0.92,0.52,0.12,1)),
]

def sample(points, n=10):
    points = [Vector(p) for p in points]
    result = []
    for i in range(len(points)-1):
        a,b,c,d = points[max(i-1,0)],points[i],points[i+1],points[min(i+2,len(points)-1)]
        for j in range(n):
            t=j/n
            result.append(0.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
    return result+[points[-1]]

def bundle(name, fiber_paths, color):
    material=bpy.data.materials.new(name)
    material.use_nodes=True
    node=next(n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value=color
    node.inputs['Roughness'].default_value=0.48
    material.diffuse_color=color
    vertices, faces=[],[]
    sides=6
    for points in fiber_paths:
        curve=sample(points)
        start=len(vertices)
        for i,p in enumerate(curve):
            tangent=(curve[min(i+1,len(curve)-1)]-curve[max(i-1,0)]).normalized()
            axis=Vector((1,0,0)) if abs(tangent.x)<0.9 else Vector((0,1,0))
            u=tangent.cross(axis).normalized();v=tangent.cross(u).normalized()
            radius=0.12*(0.65+0.35*math.sin(math.pi*i/(len(curve)-1)))
            for j in range(sides):
                angle=2*math.pi*j/sides
                vertices.append(p+radius*(u*math.cos(angle)+v*math.sin(angle)))
            if i:
                for j in range(sides):
                    a=start+(i-1)*sides+j;b=start+(i-1)*sides+(j+1)%sides
                    faces.append((a,b,b+sides,a+sides))
        faces.append(tuple(start+j for j in reversed(range(sides))))
        end=start+(len(curve)-1)*sides
        faces.append(tuple(end+j for j in range(sides)))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new('WM_'+name,mesh);tracts.objects.link(obj);obj.parent=root
    mesh.materials.append(material)
    for p in mesh.polygons:p.use_smooth=True
    obj['anatomyRole']='illustrative_tract'
    obj['label']=name
    obj['anatomical_status']='Schematic regional course; not subject-specific or validated tractography'

for name,points,color in paths:
    for side in ('source','mirrored'):
        fibers=[]
        for k in range(18):
            angle=k*2.399963;rad=0.32*math.sqrt(k)
            fiber=[]
            for x,y,z in points:
                x+=rad*math.cos(angle);z+=rad*math.sin(angle)
                fiber.append((x if side=='source' else 6.4-x,y,z))
            fibers.append(fiber)
        bundle(name+' '+side,fibers,color)

fibers=[]
for k in range(36):
    y=-14+k*1.45
    z=43+4*math.sin(math.pi*k/35)
    fibers.append([(-23,y-3,z+8),(-14,y,z+6),(-4,y,z),(3.2,y,z-1),(10.4,y,z),(20.4,y,z+6),(29.4,y-3,z+8)])
bundle('Corpus callosum',fibers,(0.83,0.66,0.22,1))
for o in list(scene.objects):
    if o.type=='EMPTY' and o!=root:
        bpy.data.objects.remove(o,do_unlink=True)
bpy.context.view_layer.update()
print('Enhanced:',len(meshes),'source meshes;',len(tracts.objects),'bundles;',sum(len(o.data.vertices) for o in scene.objects if o.type=='MESH'),'vertices')
bpy.ops.wm.save_as_mainfile(filepath='/home/qusay/Desktop/3D/artifacts/brain/brain-enhanced.blend')
