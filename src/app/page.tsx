import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="home-page">
        <div className="page-wrapper">
          <div className="flex flex-col items-center justify-center h-screen">
            <Image
              src="/krishna.png"
              alt="Dhavi Creations"
              width={200}
              height={200}
              className="mb-4"
            />
            <Image
              src="/wordmark.svg"
              alt="Dhavi Creations"
              width={400}
              height={400}
            />
            <div className="text-2xl mt-6 text-center px-4">
              Store launches October 23, 2024. Bookmark us!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
