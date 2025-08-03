//import Layout from "@/components/Layout";
import "halfmoon/css/halfmoon.min.css"; 
const headers = ["Artist", "Art Therapist", "Art Student", "Ella Beardsley"]
export default function about() {
    return (
        <>
        {/*<Layout>*/}
        <div>
            <h1>Welcome to Ella's Art Therapy Portfolio</h1>
            <p>Recent Art Therapy and Mental Health Counseling graduate at Herron School of Art and Design. I have experience working with adults and children from a variety of different backgrounds.</p>
            {/* Photo */}
            {/* Add more content here as needed */}
            <button type="button" className="btn btn-primary">Download CV</button> {/* Download CV button */}
        </div>
        {/*</Layout>*/}
        </>
    );
}