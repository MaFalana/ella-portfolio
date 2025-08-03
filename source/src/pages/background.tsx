import Layout from "@/components/Layout";
import { Text, Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineIndicator,
  TimelineRoot } from "@chakra-ui/react";
import data from "@/Ella.json"
import ScrollReveal from "@/blocks/TextAnimations/ScrollReveal/ScrollReveal";
import SpotlightCard from "@/blocks/Components/SpotlightCard/SpotlightCard";
import { RiH1 } from "react-icons/ri";


// This page will showcase Ella's professional background, including her education, certifications, and relevant experiences

export default function Background() {
    return (
        <div>
            <>
                {/* Downloadable resume */}
                <Resume />
                <Education /> 
                <Experience />
                {/* Employment/Education history - Timeline component */}
                
                
                
                {/* Certifications and relevant experiences */}
                {/* Add more content here as needed */}
            </>
        </div>
    );
}




function Experience() {    
    return (
        <>
            {/* Timeline content goes here */}
            <h1 align="center">Employment History</h1>
            {/* Content Before */}
            {/* Alternating Content */}

            <Timeline.Root size="lg" variant="outline">
                {data.Employment.map((item, index) => (
                <Timeline.Item key={`employment-${index}`}>
                    {index % 2 === 0 ? (
                    <>
                        {/* Left side empty, right side content */}
                        <Timeline.Content flex="1" />
                        <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator />
                        </Timeline.Connector>
                        <Timeline.Content flex="1" alignItems="flex-start">
                        {/*<ScrollReveal baseOpacity={0.5} enableBlur={true} baseRotation={0} blurStrength={4}>*/}
                            <SpotlightCard>
                                <h1>{item.title}</h1>
                                <Text fontWeight="semibold">{item.company}</Text>
                                <Text fontSize="sm" color="gray.500">{item.location}</Text>
                                <Text fontSize="xs" color="gray.400">
                                {item.startDate} - {item.endDate}
                                </Text>
                            </SpotlightCard>
                        {/*</ScrollReveal>*/}
                        </Timeline.Content>
                    </>
                    ) : (
                    <>
                        {/* Left side content, right side empty */}
                        <Timeline.Content flex="1" alignItems="flex-end" textAlign="right">
                        {/*<ScrollReveal baseOpacity={0.5} enableBlur={true} baseRotation={0} blurStrength={4}>*/}
                            <SpotlightCard>
                                <h1>{item.title}</h1>
                                <Text fontWeight="semibold">{item.company}</Text>
                                <Text fontSize="sm" color="gray.500">{item.location}</Text>
                                <Text fontSize="xs" color="gray.400">
                                {item.startDate} - {item.endDate}
                                </Text>
                            </SpotlightCard>
                        {/*</ScrollReveal>*/}
                        </Timeline.Content>
                        <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator />
                        </Timeline.Connector>
                        <Timeline.Content flex="1" />
                    </>
                    )}
                </Timeline.Item>
                ))}
                
                </Timeline.Root>


                

            {/* Composition */}
        </>
    );

}

function Education() {
    return (
        <>
            <h1 align="center">Education</h1>
            <Timeline.Root size="lg" variant="outline">
                {data.Education.map((item, index) => (
                    <Timeline.Item key={`education-${index}`}>
                        {index % 2 === 0 ? (
                            <>
                                <Timeline.Content flex="1" />
                                <Timeline.Connector>
                                    <Timeline.Separator />
                                    <Timeline.Indicator />
                                </Timeline.Connector>
                                <Timeline.Content flex="1" alignItems="flex-start">
                                    <SpotlightCard>
                                        <h1>{item.degree}</h1>
                                        <Text fontWeight="semibold">{item.institution}</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            {item.startDate} - {item.endDate}
                                        </Text>
                                    </SpotlightCard>
                                </Timeline.Content>
                            </>
                        ) : (
                            <>
                                <Timeline.Content flex="1" alignItems="flex-end" textAlign="right">
                                    <SpotlightCard>
                                        <h1>{item.degree}</h1>
                                        <Text fontWeight="semibold">{item.institution}</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            {item.startDate} - {item.endDate}
                                        </Text>
                                    </SpotlightCard>
                                </Timeline.Content>
                                <Timeline.Connector>
                                    <Timeline.Separator />
                                    <Timeline.Indicator />
                                </Timeline.Connector>
                                <Timeline.Content flex="1" />
                            </>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline.Root>
                
            {/* Composition */}
        </>
    );
}

{/*Skills?*/}

function Resume() {
    return (
        <>
            <h1>Downloadable Resume</h1>
            <p>Click the link below to download my resume.</p>
            <a href="/path/to/resume.pdf" download>Download Resume</a>

            {/* Section Header? */}
            {/* Call to Action */}
            {/* Button link to resume pdf */}
        </>
    );
}