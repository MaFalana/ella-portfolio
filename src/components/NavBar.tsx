//import { Link } from "next/link"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // For Pages Router (which you're using)
import GooeyNav from '@/blocks/Components/GooeyNav/GooeyNav';


// update with your own items
const items = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Background", href: "/background" },
    { label: "Shop", href: "/shop" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
];



export default function NavBar() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    // Set the active index based on current route
    useEffect(() => {
        const index = items.findIndex(item => item.href === router.pathname);
        setActiveIndex(index !== -1 ? index : 0);
    }, [router.pathname]);

  return (
    <div style={{ position: 'relative' }}>
        <GooeyNav
        items={items}
        particleCount={3}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={activeIndex}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
    </div>
  );
}




