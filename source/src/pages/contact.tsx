import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <Layout>
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Get in Touch</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#718096' }}>
          I'd love to hear from you! Whether you have questions about art therapy or want to discuss a potential collaboration, feel free to reach out.
        </p>
        <ContactForm />
      </main>
    </Layout>
  );
}