import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
  stack: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
    stack: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Erro desconhecido',
      stack: error?.stack || '',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Render crash:', error, info.componentStack)
  }

  private handleResetStorage = () => {
    try {
      localStorage.removeItem('precificacao_state')
    } catch (error) {
      console.error('[ErrorBoundary] Failed to clear localStorage:', error)
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            background: '#12121a',
            color: '#f5f5f5',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: 640,
              width: '100%',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              padding: 24,
              background: 'rgba(30,30,40,0.85)',
            }}
          >
            <h1 style={{ marginTop: 0, fontSize: 22 }}>Falha ao carregar a aplicação</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              Provável incompatibilidade do estado salvo no navegador após a
              reestruturação da store. Limpe o armazenamento local e recarregue.
            </p>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 12,
                padding: 12,
                fontSize: 12,
                color: '#ffb4c0',
              }}
            >
              {this.state.message}
              {this.state.stack ? `\n\n${this.state.stack}` : ''}
            </pre>
            <button
              type="button"
              onClick={this.handleResetStorage}
              style={{
                marginTop: 12,
                border: 0,
                borderRadius: 12,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #9d4edd, #e050a2)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Limpar localStorage e recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
