import { Component } from 'react';

/**
 * If one section of a page crashes (for example because of unexpected
 * content), only that section disappears; the rest of the page keeps working.
 */
export default class SafeSection extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(`[section:${this.props.name || 'unnamed'}]`, error);
  }

  componentDidUpdate(prevProps) {
    // Retry when the content changes (e.g. an editor fixes it in the preview).
    if (this.state.failed && prevProps.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
