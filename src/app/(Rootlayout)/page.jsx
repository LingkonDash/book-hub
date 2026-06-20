import BestSellers from "@/components/home/BestSellers";
import Banner from "../../components/home/Banner";
import CategoryBrowse from "@/components/home/CategoryBrowse";


export default async function Home() {

  return (
    <>
      <Banner />
      <CategoryBrowse />
      <BestSellers />
    </>
  );
}
