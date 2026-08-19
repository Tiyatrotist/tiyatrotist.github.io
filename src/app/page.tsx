import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScrollScene from '@/components/ScrollScene';
import SecondScene from '@/components/SecondScene';
import ProjectIntro from '@/components/ProjectIntro';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="main-container">
      <Header />
      <Hero />
      <ScrollScene>
        <SecondScene />
        <ProjectIntro />
      </ScrollScene>
      <Footer />
    </main>
  );
}
