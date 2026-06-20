import Banner from "../../components/home/Banner";
import CategoryBrowse from "@/components/home/CategoryBrowse";
import BenefitsMarquee from "@/components/home/BenefitsMarquee";
import BestSeller from "@/components/home/popularSection/BestSeller";
import PopularSection from "@/components/home/popularSection/PopularSection";



export default async function Home() {

  return (
    <>
      <Banner />
      <BenefitsMarquee />
      <CategoryBrowse />
      <BestSeller />
      <PopularSection />
    </>
  );
}
