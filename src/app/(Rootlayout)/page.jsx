import Banner from "../../components/home/Banner";
import CategoryBrowse from "@/components/home/CategoryBrowse";
import BenefitsMarquee from "@/components/home/BenefitsMarquee";
import BestSeller from "@/components/home/BestSeller";
import PopularSection from "@/components/home/PopularSection";
import NewsletterSection from "@/components/home/Newsletter";
import HowItWorks from "@/components/home/HowItWorks";
import ContactSection from "@/components/home/Contact";
import TopLibrarians from "@/components/home/TopLibrarians";
import { getFeaturedBooks } from "@/lib/api/getBooks";
import { getTopLibrarians } from "@/lib/api/getTopLibrarians";



export default async function Home() {

  const featuredBooks = await getFeaturedBooks()
  const librarians = await getTopLibrarians();

  return (
    <>
      <Banner />
      <BenefitsMarquee />
      <CategoryBrowse />
      <BestSeller featuredBooks={featuredBooks} />
      <TopLibrarians librarians={librarians} />
      <PopularSection />
      <HowItWorks />
      <ContactSection />
      <NewsletterSection />
    </>
  );
}
