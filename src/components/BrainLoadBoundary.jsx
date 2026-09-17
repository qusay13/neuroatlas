import { Component } from 'react';
import { useGLTF } from '@react-three/drei';

export default class BrainLoadBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="brain-loading brain-loading-error" role="alert">
      <strong>تعذّر تحميل نموذج الدماغ</strong>
      <span>تحقّق من الاتصال ثم حاول مجددًا.</span>
      <button onClick={() => {
        useGLTF.clear(`${import.meta.env.BASE_URL}brain-optimized.glb`);
        this.setState({ failed: false });
      }}>إعادة المحاولة</button>
    </div>;
    return this.props.children;
  }
}
