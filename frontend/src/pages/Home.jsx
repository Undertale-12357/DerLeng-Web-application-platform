import SearchBar from "../components/HomeComponent/SearchBar";
import { DisplayBanner0 } from "../components/HomeComponent/DisplayBanner0";
// import { DisplayBanner } from "../components/HomeComponent/DisplayBanner";
import { DisplayBanner2 } from "../components/HomeComponent/DisplayBanner2";
import Title from "../components/HomeComponent/Title";
import { Title2 } from "../components/HomeComponent/Title2";
import { Title3 } from "../components/HomeComponent/Title3";
import { Title4 } from "../components/HomeComponent/Title4";
import InterestPanel from "../components/HomeComponent/InterestPanel";
import InterestPanel2 from "../components/HomeComponent/InterestPanel2";
import InterestPanel3 from "../components/HomeComponent/InterestPanel3";
import InterestPanel4 from "../components/HomeComponent/InterestPanel4";
import InterestPanel5 from "../components/HomeComponent/InterestPanel5";
import { Advertise } from "../components/HomeComponent/Advertise";
import { DisplayBanner3 } from "../components/HomeComponent/DisplayBanner3";
import { SubHeader } from "../components/HomeComponent/SubHeader";


export default function Home() {
  return (
    <div className="w-full">
      {/* Title */}
      <div className="w-full bg-white py-8 px-2">
        <div className="mx-auto max-w-7xl">
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', color: '#002B11', fontFamily: "'Kantumruy Pro', sans-serif" }}>
            តោះដេីរលេង?
          </h1>
        </div>
      </div>

      {/* SearchBar Section */}
      <div className="w-full py-4 px-4 bg-white flex justify-center">
        <div className="w-full max-w-7xl">
          <SearchBar />
        </div>
      </div>

      {/* Find Things To Do Title - Under Banner */}
      <Title />
      
      {/* Display Banner */}
      <div className="w-full px-6 bg-white flex justify-center">
        <div className="w-full max-w-7xl">
          <DisplayBanner0 />
        </div>
      </div>


      {/* Interest Panel */}
      <InterestPanel />

      {/* Display Banner 2 */}
      <div className="w-full px-6 bg-white flex justify-center py-8">
        <div className="w-full max-w-7xl">
          <DisplayBanner2 />
        </div>
      </div>

      {/* Title 2 - Under Banner 2 */}
      <Title2 />
      
      {/* Interest Panel */}
      <InterestPanel2 />

      {/* Interest Panel */}
      <Advertise />

      {/* Title 3 - Under Banner 3 */}
      <Title3 />

      {/* Interest Panel */}
      <InterestPanel3 />

      {/* Title 4 - Under Banner 3 */}
      {/* <Title4 /> */}

      {/* Interest Panel */}
      {/* <InterestPanel4 /> */}

      {/* Sub header - Under Banner 4 */}
      <SubHeader />

      {/* Interest Panel */}
      <InterestPanel5 />

      {/* Spacing between InterestPanel5 and DisplayBanner3 */}
      <div className="w-full h-8"></div>

      {/* Display Banner */}
      <div className="w-full px-6 bg-white flex justify-center">
        <div className="w-full max-w-7xl">
          <DisplayBanner3 />
        </div>
      </div>

      {/* Additional Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Add your home page content here */}
      </div>
    </div>
  );
}
