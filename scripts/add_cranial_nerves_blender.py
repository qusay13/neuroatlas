"""Run via Blender MCP on Brain Enhanced. Schematic proximal CN anatomy only."""
import bpy, bmesh, json, math, os, shutil
from mathutils import Vector

BASE='/home/qusay/Desktop/3D'
scene=bpy.context.scene
assert scene.name.startswith('Brain Enhanced'), 'Select the enhanced scene first'
root=next(o for o in scene.objects if o.type=='EMPTY' and o.name.startswith('Brain_Enhanced'))
data=json.load(open(BASE+'/src/data/neuralStructures.json'))
if not os.path.exists(BASE+'/artifacts/brain/brain-before-cranial.glb'):
    shutil.copy2(BASE+'/public/brain.glb',BASE+'/artifacts/brain/brain-before-cranial.glb')
for o in list(scene.objects):
    if o.get('cranialAddition'): bpy.data.objects.remove(o,do_unlink=True)
collection=bpy.data.collections.get('04 Cranial nerves - schematic')
if collection is None:
    collection=bpy.data.collections.new('04 Cranial nerves - schematic')
    scene.collection.children.link(collection)

def material(name,color):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes=True;m.diffuse_color=color
    n=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    n.inputs['Base Color'].default_value=color;n.inputs['Roughness'].default_value=0.5
    return m
gold=material('Cranial nerves - warm ivory',(0.93,0.65,0.22,1))
tissue=material('Brainstem - muted rose',(0.43,0.26,0.20,1))
olive=material('Brainstem landmarks',(0.55,0.36,0.25,1))
eye=material('Orbital endpoint guides',(0.22,0.30,0.34,1))

def mesh_object(name,verts,faces,mat,role,identifier=None):
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
    obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj);obj.parent=root
    mesh.materials.append(mat)
    for p in mesh.polygons:p.use_smooth=True
    obj['cranialAddition']=True;obj['anatomyRole']=role
    obj['anatomical_status']='Schematic educational geometry; not registered imaging or measured anatomy'
    if identifier:obj['structureId']=identifier
    return obj

def ellipsoid(name,center,radii,mat,role='anatomical_support',identifier=None):
    verts=[];faces=[];n=32;m=20
    verts.append((center[0],center[1],center[2]+radii[2]))
    for i in range(1,m):
        a=math.pi*i/m
        for j in range(n):
            b=2*math.pi*j/n
            verts.append((center[0]+radii[0]*math.sin(a)*math.cos(b),center[1]+radii[1]*math.sin(a)*math.sin(b),center[2]+radii[2]*math.cos(a)))
    bottom=len(verts);verts.append((center[0],center[1],center[2]-radii[2]))
    for j in range(n):
        faces.append((0,1+j,1+(j+1)%n))
        faces.append((bottom,1+(m-2)*n+(j+1)%n,1+(m-2)*n+j))
    for i in range(m-2):
        for j in range(n):
            a=1+i*n+j;b=1+i*n+(j+1)%n;faces.append((a,a+n,b+n,b))
    return mesh_object(name,verts,faces,mat,role,identifier)

def sample(points):
    points=[Vector(p) for p in points];out=[]
    for i in range(len(points)-1):
        a,b,c,d=points[max(i-1,0)],points[i],points[i+1],points[min(i+2,len(points)-1)]
        for j in range(12):
            t=j/12
            out.append(0.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
    return out+[points[-1]]

def nerve(name,paths,identifier,side):
    verts=[];faces=[];sides=10
    for points,radius in paths:
        curve=sample([(3.2+side*x,y,z) for x,y,z in points]);start=len(verts)
        previous=None
        for i,p in enumerate(curve):
            tangent=(curve[min(i+1,len(curve)-1)]-curve[max(0,i-1)]).normalized()
            if previous is None:
                axis=Vector((1,0,0)) if abs(tangent.x)<0.9 else Vector((0,1,0))
                u=tangent.cross(axis).normalized()
            else:u=(previous-tangent*previous.dot(tangent)).normalized()
            v=tangent.cross(u).normalized();previous=u
            r=radius*(1-0.20*(i/(len(curve)-1))**3)
            for j in range(sides):
                a=2*math.pi*j/sides;verts.append(p+r*(u*math.cos(a)+v*math.sin(a)))
            if i:
                for j in range(sides):
                    a=start+(i-1)*sides+j;b=start+(i-1)*sides+(j+1)%sides;faces.append((a,b,b+sides,a+sides))
        faces.append(tuple(start+j for j in reversed(range(sides))))
        end=start+(len(curve)-1)*sides;faces.append(tuple(end+j for j in range(sides)))
    obj=mesh_object(name,verts,faces,gold,'cranial_nerve',identifier)
    obj['side']='left' if side<0 else 'right'
    entry=next(e for e in data['cranialNerves'] if e['id']==identifier)
    for key in ('name','english','function','course','source','roman'):obj[key]=entry[key]
    return obj

# Brainstem scaffold, aligned with the source's superior Z / anterior Y axes.
ellipsoid('Midbrain - schematic',(3.2,-5,18),(8,8,12),tissue)
ellipsoid('Pons - schematic',(3.2,-8,3),(13,9,10),tissue)
ellipsoid('Medulla - schematic',(3.2,-13,-12),(6.2,6.5,12),tissue)
ellipsoid('Upper cervical cord - schematic',(3.2,-16,-29),(3.8,4,13),tissue)
for side in (-1,1):
    ellipsoid('Olive '+str(side),(3.2+side*4.4,-8.7,-11),(1.9,2.2,4.6),olive)
    ellipsoid('Pyramid '+str(side),(3.2+side*1.5,-7.5,-14),(1.2,1.5,6),olive)
    ellipsoid('Olfactory bulb '+str(side),(3.2+side*7,47,21),(2.1,5,1.7),gold,'cranial_nerve','cn-01')
    ellipsoid('Eye endpoint guide '+str(side),(3.2+side*20,64,15),(5,5,5),eye,'anatomical_support')

for s in (-1,1):
    # I: multiple olfactory fila join the bulb; tract shown for context.
    paths=[([(7,45,21),(7,35,18),(8,26,17),(11,20,18)],0.55)]
    for k in range(8):
        y=43+k*1.0;paths.append(([(7+(k%2-0.5)*3,y,16),(7+(k%2-0.5),y,19),(7,y,21)],0.16))
    nerve('CN I '+str(s),paths,'cn-01',s)
    # II: common optic nerve, separate crossing and uncrossed strands at chiasm.
    nerve('CN II '+str(s),[
        ([(20,60,15),(17,43,12),(10,29,13),(2,22,15)],1.0),
        ([(2,22,15),(-1,20,15),(-6,16,16),(-11,8,20)],0.52),
        ([(3,23,15),(4,19,15),(8,15,17),(11,8,20)],0.52)],'cn-02',s)
    nerve('CN III '+str(s),[([(3.5,1,17),(5,8,12),(9,18,10),(13,31,12)],0.55)],'cn-03',s)
    nerve('CN IV '+str(s),[([(3,-12,24),(8,-10,22),(10,-3,18),(12,9,15),(14,30,16)],0.30)],'cn-04',s)
    nerve('CN V '+str(s),[
        ([(11,-5,5),(16,0,4),(21,7,5)],1.0),
        ([(21,7,5),(23,19,7),(23,33,11)],0.55),
        ([(21,7,5),(28,14,3),(34,24,4)],0.65),
        ([(21,7,5),(30,8,-1),(34,12,-6)],0.72)],'cn-05',s)
    nerve('CN VI '+str(s),[([(2.5,-1,-5),(4,7,-3),(7,19,3),(11,31,7)],0.37)],'cn-06',s)
    nerve('CN VII '+str(s),[([(9,-5,-5),(14,-1,-5),(22,4,-3)],0.48), ([(10,-5.8,-5.8),(15,-0.8,-5.8),(22,4,-3.6)],0.19)],'cn-07',s)
    nerve('CN VIII '+str(s),[([(11,-8,-6),(17,-5,-5),(25,1,-4)],0.67), ([(11,-9,-7),(18,-5,-6.7),(25,1,-5.3)],0.47)],'cn-08',s)
    for number,z,count,radius in [(9,-8,3,0.22),(10,-12,5,0.24)]:
        paths=[]
        for k in range(count):
            paths.append(([(5.8,-12,z-k*0.8),(9,-10,z-0.5),(14,-6,z-1)],radius))
        paths.append(([(14,-6,z-1),(20,-3,z-3),(23,0,z-6)],0.52 if number==9 else 0.7))
        nerve('CN '+str(number)+' '+str(s),paths,'cn-%02d'%number,s)
    paths=[([(4,-16,-35),(7,-15,-25),(8,-14,-14),(10,-11,-8),(16,-7,-12),(22,-4,-20)],0.52)]
    for k in range(6):
        z=-35+k*3;paths.append(([(3,-15,z),(5,-15,z+1),(7,-15,z+3)],0.18))
    nerve('CN XI '+str(s),paths,'cn-11',s)
    paths=[]
    for k in range(5):
        paths.append(([(2.9,-6.8,-9-k*1.3),(6,-3,-13),(11,3,-14)],0.22))
    paths.append(([(11,3,-14),(15,9,-14),(20,16,-12)],0.6))
    nerve('CN XII '+str(s),paths,'cn-12',s)

# Posteroinferior inclination makes the ventral roots and cord readable from below.
for obj in collection.objects:
    for vertex in obj.data.vertices:
        vertex.co.y += 0.6 * min(0, vertex.co.z - 20)
    obj.data.update()

for obj in scene.objects:
    if obj.get('anatomyRole')=='illustrative_tract':
        entry=next(e for e in data['tracts'] if obj.get('label','').startswith(e['english']))
        obj['structureId']=entry['id']
        for key in ('name','function','course','source'):obj[key]=entry[key]
    obj.hide_set(False)
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=BASE+'/artifacts/brain/brain-cranial.blend')
import contextlib,io
with contextlib.redirect_stdout(io.StringIO()):
    bpy.ops.export_scene.gltf(filepath=BASE+'/artifacts/brain/brain-cranial.glb',use_active_scene=True,export_extras=True,export_animations=False,export_cameras=False,export_lights=False,export_texcoords=False)
print('CN IDs',sorted(set(o.get('structureId') for o in collection.objects if o.get('structureId'))))
print('Added objects',len(collection.objects),'bytes',os.path.getsize(BASE+'/artifacts/brain/brain-cranial.glb'))
