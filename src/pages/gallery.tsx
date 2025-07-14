// 3. Portfolio / Gallery
// Art Therapy Work (photos of sessions or anonymized project results—only if appropriate and ethical)
// Personal Art & Creations
// Divided by medium (painting, sculpture, textile, etc.)
// Emphasize "one-of-one" uniqueness
// Process section (how pieces are made, inspiration, materials)
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
//import Masonry from '@/blocks/Components/Masonry/Masonry';
const Masonry = dynamic(() => import('@/blocks/Components/Masonry/Masonry'), {ssr: false,});
import data from "@/Ella.json"


export default function Gallery() {
  return (
      <Layout>
      
        <GalleryContent />
      
      </Layout>
  );
}

const items = [
    { id: '1', img: '/assets/IMG_6758.jpeg', url: '', height: 400 },
    { id: '2', img: '/assets/IMG_4840.jpeg', url: '', height: 250 },
    { id: '3',img: '/assets/IMG_5717.jpeg', url: '', height: 600 },
    { id: '4', img: '/assets/IMG_1277.jpeg', url: '', height: 300 },
    { id: '5', img: '/assets/IMG_3090.jpeg', url: '', height: 500 },
    { id: '6', img: '/assets/IMG_3164.jpeg', url: '', height: 350 },
    { id: '7', img: '/assets/Mind%20Control.jpeg', url: '', height: 650 },
    { id: '8', img: '/assets/IMG_7257.jpeg', url: '', height: 400 },
    { id: '9', img: '/assets/Neurotic.jpeg', url: '', height: 300 },
    { id: '10', img: '/assets/Utopia.jpeg', url: '', height: 700 },

  // Add more items as needed
];

function GalleryContent() {
  return (
    <>
    <div>
      <h1>Gallery</h1>
      <p>Welcome to the gallery! Here you can explore various artworks and creations.</p>
      {/* Add your gallery content here */}
    </div>

    <Masonry
        items={data.Art}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
    />
    </>
  );
}