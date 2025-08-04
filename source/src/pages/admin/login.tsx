import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect to admin panel
            router.push('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="admin-login-container">
                <div className="login-box">
                    <h1>Admin Login</h1>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password">Admin Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .admin-login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f7fafc;
                }

                .login-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: #2d3748;
                }

                .error-message {
                    background: #fed7d7;
                    color: #c53030;
                    padding: 0.75rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #4a5568;
                    font-weight: 500;
                }

                input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                input:disabled {
                    background: #f7fafc;
                    cursor: not-allowed;
                }

                button {
                    width: 100%;
                    padding: 0.75rem;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                button:hover:not(:disabled) {
                    background: #5a67d8;
                }

                button:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                }
            `}</style>
        </Layout>
    );
}