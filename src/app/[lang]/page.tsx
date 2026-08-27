import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScrollScene from '@/components/ScrollScene';
import SecondScene from '@/components/SecondScene';
import ProjectIntro from '@/components/ProjectIntro';
import Footer from '@/components/Footer';
import { Locale, getDictionary } from '@/dictionaries';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <Hero lang={currentLang} dict={dict} />
      <ScrollScene>
        <SecondScene dict={dict} />
        <ProjectIntro lang={currentLang} dict={dict} />
      </ScrollScene>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
