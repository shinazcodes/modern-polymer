/* This example requires Tailwind CSS v2.0+ */
import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline";

const features = [
  {
    name: "My jobs",
    total: "5",
    icon: GlobeAltIcon,
  },
  {
    name: "Pending jobs",
    total: "2",
    icon: ScaleIcon,
  },
  {
    name: "Ongoing jobs",
    total: "0",
    icon: LightningBoltIcon,
  },
];

export default function Example() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center justify-center flex flex-col items-center">
          <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
            <ScaleIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-10 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Hello shinaz azeez
          </p>
          <p className="mt-20 max-w-2xl text-xl text-gray-500 lg:mx-auto text-center">
            Registered email : shinaz5@hometech.com
          </p>
        </div>

        <dl className="flex flex-row flex-wrap content-between justify-around fixed p-4 bottom-0 left-0 w-full">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <div className="flex flex-col items-center">
                <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className=" text-lg font-medium text-gray-900">
                  {feature.name}
                </p>
                <p className=" text-lg font-medium text-gray-900">
                  {feature.total}
                </p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
