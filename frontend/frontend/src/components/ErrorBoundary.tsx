import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 存储详细错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 发送错误信息到调试工具
    if ((window as any).debugTools) {
      (window as any).debugTools.lastError = {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };
    }

    // 在开发环境中显示更多信息
    if (import.meta.env.DEV) {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleReload = () => {
    // 清理可能损坏的状态
    localStorage.removeItem('debug_verbose');
    sessionStorage.clear();
    
    // 重新加载页面
    window.location.reload();
  };

  handleReset = async () => {
    try {
      // 紧急重置
      const { indexedDBStorage } = await import('@/utils/IndexedDBStorage');
      await indexedDBStorage.clearAll();
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>💥 应用出现错误</Alert.Heading>
            <p>
              很抱歉，应用遇到了一个意外错误。这可能是由于代码错误或数据损坏导致的。
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-3">
                <summary>错误详情（开发环境）</summary>
                <pre className="mt-2 p-3 bg-light small">
                  <strong>错误消息:</strong> {this.state.error.message}
                  {'\n\n'}
                  <strong>错误堆栈:</strong>
                  {'\n'}
                  {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>组件堆栈:</strong>
                      {'\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.handleReload}>
                重新加载页面
              </Button>
              <Button variant="outline-danger" onClick={this.handleReset}>
                重置应用数据
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
