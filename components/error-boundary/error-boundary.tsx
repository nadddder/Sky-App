// components/error-boundary/error-boundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { performanceMonitor } from '~/services/performance';
import { ErrorScreen } from './error-screen';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        performanceMonitor.startMeasure('ErrorBoundary-Recovery');

        // Log error to your preferred logging service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        performanceMonitor.endMeasure('ErrorBoundary-Recovery');
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <ErrorScreen
                    error={this.state.error}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}