import Image from "next/image";

export default function FooterWeb() {
  return (
    <footer>
      <div className="container">
        <div className="py-8 flex flex-col w-full gap-4 text-center">
          <Image
            src="/images/kekawinan-logo.png"
            alt="Kekawinan"
            width={200}
            height={200}
            className="w-[150px] md:w-[200px] mx-auto"
            priority
          />
          <hr />
          <div className="cpright">
            © 2022 - {new Date().getFullYear()} Kekawinan.com - Create with Love by
            Partnerinaja.com
          </div>
        </div>
      </div>
    </footer>
  );
}
