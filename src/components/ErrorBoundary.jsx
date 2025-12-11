import { Component } from 'react';
import { Result, Button } from 'antd';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 * and displays a fallback UI instead of crashing the app
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console (could send to error reporting service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoBack = () => {
        window.history.back();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: '#f5f5f5'
                }}>
                    <Result
                        status="500"
                        title="Oops! Something went wrong"
                        subTitle="We're sorry, but something unexpected happened. Please try again."
                        extra={[
                            <Button type="primary" key="reload" onClick={this.handleReload}>
                                Reload Page
                            </Button>,
                            <Button key="back" onClick={this.handleGoBack}>
                                Go Back
                            </Button>,
                        ]}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}
