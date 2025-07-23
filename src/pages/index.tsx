import Layout from "@/components/Layout";
import ScrollReveal from "@/blocks/TextAnimations/ScrollReveal/ScrollReveal";
import About from "./about";
import Background from "./background";
import Gallery from "./gallery";
export default function Home() {
    return (

        <Layout>
             <section className="hero-section">
                <h1>Welcome to our website!</h1>
                <p>Learn more about what we do.</p>
              </section>

              <section className="About-section">
                <h1>Welcome to our website!</h1>
                <p>Learn more about what we do.</p>
              </section>

              <section className="Background-section">
                <h1>Welcome to our website!</h1>
                <p>Learn more about what we do.</p>
                <Background/>
              </section>

              <section className="Gallery-section">
                <Gallery/>
              </section>

              <section className="Contact-section">
                <h1>Welcome to our website!</h1>
                <p>Learn more about what we do.</p>
              </section>
        </Layout>

    );
}