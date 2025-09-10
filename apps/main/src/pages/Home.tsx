import Hero from "@/components/Hero";
import {
  Feature,
  FlipCodeSkeleton,
  ScreenShotCard,
  ScreenShotDescription,
  ScreenShotTitle,
  SkeletonFour,
  SkeletonOne,
  SkeletonTwo,
} from "@/components/ui/landing";
import { motion } from "framer-motion";
import landing from "@/assets/landing";
import { Upload, ShieldCheck, Smartphone, Sparkles } from "lucide-react";

const screenshots = [
  {
    title: "Check out Video Library for public videos",
    description:
      "Uploaded videos are public by default and will be added to Video library for showcase",
    skeleton: (
      <SkeletonOne img_src="https://res.cloudinary.com/mikeaig4real/image/upload/v1757514822/Screenshot_2025-09-10_141526_cifrwm.png" />
    ),
    className:
      "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
  },
  {
    title: "Upload, Manage, Monitor Views of Videos in Dashboard",
    description:
      "Upload multiple videos with progress update/retrial on errors and more, View videos/Get embeddable iframe code, Change video metadata, check views (coming soon)",
    skeleton: (
      <SkeletonTwo
        top_images={[
          "https://res.cloudinary.com/mikeaig4real/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1757514821/Screenshot_2025-09-10_141224_tyih9v.png",
          "https://res.cloudinary.com/mikeaig4real/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1757514820/Screenshot_2025-09-10_141402_npd3jr.png",
        ]}
        bottom_images={[
          "https://res.cloudinary.com/mikeaig4real/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1757514821/Screenshot_2025-09-10_141326_g594m1.png",
          "https://res.cloudinary.com/mikeaig4real/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1757514820/Screenshot_2025-09-10_141302_htikgp.png",
        ]}
      />
    ),
    className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
  },
  {
    title: "Embed Anywhere",
    description:
      "Stream videos easily using our lightweight iframe widget. We give you the code for your public videos and then you just copy and paste it anywhere",
    skeleton: (
      <FlipCodeSkeleton
        embedCode={landing.embedCode}
        iframeSrc={landing.embedUrl}
      />
    ),
    className: "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
  },
  {
    title: "Top Notch Reliability",
    description:
      "You can always retry failed uploads, We also help in automatic retries, automatic persistence of data, out system is cloud agnostic so be rest assured wherever you are.",
    skeleton: <SkeletonFour />,
    className: "col-span-1 lg:col-span-3 border-b lg:border-none",
  },
];

const features = [
  {
    icon: <Upload />,
    title: "Batch Uploads",
    desc: "Upload multiple videos at once with full reliability.",
  },
  {
    icon: <ShieldCheck />,
    title: "Duplicate Prevention",
    desc: "Robust hashing ensures no duplicate uploads.",
  },
  {
    icon: <Sparkles />,
    title: "Real-Time Feedback",
    desc: "Stay updated with progress, errors, and retries.",
  },
  {
    icon: <Smartphone />,
    title: "Responsive Design",
    desc: "Works seamlessly on desktop and mobile.",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col w-screen select-none">
      {/* Hero */}
      <Hero />

      {/* Features */}
      <section className="py-16 bg-transparent text-black dark:text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Video Hub...?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-transparent shadow hover:shadow-lg"
              >
                <Feature key={feature.title} {...feature} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Preview */}
      <section className="py-16 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Beautiful Dashboard And Video Library
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-10">
            Manage uploads, edit metadata, and explore your video library with
            ease.
          </p>
          <div className="relative ">
            <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
              {screenshots.map((screenshot) => (
                <ScreenShotCard
                  key={screenshot.title}
                  className={screenshot.className}
                >
                  <ScreenShotTitle>{screenshot.title}</ScreenShotTitle>
                  <ScreenShotDescription>
                    {screenshot.description}
                  </ScreenShotDescription>
                  <div className=" h-full w-full">{screenshot.skeleton}</div>
                </ScreenShotCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Built with Modern Tools</h2>
          <div className="flex justify-center flex-wrap gap-8">
            {[
              "React",
              "TypeScript",
              "Vite",
              "Zustand",
              "Tailwind",
              "FastAPI",
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow"
              >
                <p className="text-lg font-medium">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
