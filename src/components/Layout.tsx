import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import "@/styles/globals.css";
export default function Layout({ children }) {
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

