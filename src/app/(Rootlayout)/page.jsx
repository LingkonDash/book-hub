import Banner from "../../components/home/Banner";
import CategoryBrowse from "@/components/home/CategoryBrowse";
import BenefitsMarquee from "@/components/home/BenefitsMarquee";
import BestSeller from "@/components/home/BestSeller";
import PopularSection from "@/components/home/PopularSection";
import NewsletterSection from "@/components/home/Newsletter";
import HowItWorks from "@/components/home/HowItWorks";
import ContactSection from "@/components/home/Contact";



export default async function Home() {

  return (
    <>
      <Banner />
      <BenefitsMarquee />
      <CategoryBrowse />
      <BestSeller />
      <PopularSection />
      <HowItWorks />
      <ContactSection />
      <NewsletterSection />
    </>
  );
}
