import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="layout-container">
            <NavBar />
                <main className="main-content">
                {children}
                </main>
            <Footer />
        </div>
    );
}

