import { MainLayout } from '../layouts/MainLayout';
import { Breadcrumb } from '../components/Breadcrumb';
import { Check } from 'lucide-react';

export default function AboutUs() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
  ];

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb items={breadcrumbItems} />

        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h2 className='text-[#6b83b6] text-xl mb-2'>About Us</h2>
            <h1 className='text-[#0e224d] text-4xl font-bold mb-8'>
              Global Leading Online Shop
            </h1>

            <div className='grid md:grid-cols-2 gap-8 items-center'>
              <div className='space-y-6'>
                <p className='text-[#4c6290] leading-relaxed'>
                  At Industrywaala, we are dedicated to providing our customers
                  with an extensive selection of high-quality industrial goods
                  at wholesale prices. Our goal is to simplify the procurement
                  process for businesses of all sizes and make it easier to find
                  and purchase the products you need.
                </p>
                <p className='text-[#4c6290] leading-relaxed'>
                  Since our establishment, we have worked tirelessly to
                  establish ourselves as a trusted source for industrial goods
                  in India. With a fully catalogued collection of over 1000+
                  SKUs from leading brands around the world, our website makes
                  it easy to find the products you need.
                </p>
                <p className='text-[#4c6290] leading-relaxed'>
                  We take pride in our commitment to exceptional customer
                  service, and our team of experts is always available to help
                  you find the right product for your business. Whether you're
                  looking for tools, machinery, safety equipment, or any other
                  industrial product, we have the expertise and experience to
                  help you make an informed decision.
                </p>

                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <div className='flex items-start gap-2'>
                    <div className='bg-[#0e224d] p-1 rounded-md mt-0.5'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-[#4c6290] font-medium'>
                      We provide qualified & expert
                    </span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='bg-[#0e224d] p-1 rounded-md mt-0.5'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-[#4c6290] font-medium'>
                      Modern tools & technology use
                    </span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='bg-[#0e224d] p-1 rounded-md mt-0.5'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-[#4c6290] font-medium'>
                      Neat & cleaning top Services
                    </span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='bg-[#0e224d] p-1 rounded-md mt-0.5'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-[#4c6290] font-medium'>
                      We Develop Digital Future
                    </span>
                  </div>
                </div>
              </div>
              <div className='rounded-lg overflow-hidden'>
                <img
                  src='https://res.cloudinary.com/da3r1iagy/image/upload/v1742988092/img_m8u7c7.png'
                  alt='Team collaboration'
                  className='w-full h-auto object-cover'
                />
              </div>
            </div>
          </div>

          <div className='mb-16'>
            <h2 className='text-[#6b83b6] text-xl mb-2'>Our Partners</h2>
            <h3 className='text-[#0e224d] text-3xl font-bold mb-8'>
              Trusted by 100+ Vendors
            </h3>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
              {[
                'Bosch',
                'Pidilite',
                'Daikin',
                'Paramount',
                'RR Global',
                '3M',
                'Astral Adhesives',
                'Loctite',
                'Aerofoam',
                'Nanova Carecoat',
              ].map((brand, index) => (
                <div key={index} className='flex items-center justify-center'>
                  <div className='text-gray-300 font-bold text-xl'>{brand}</div>
                </div>
              ))}
            </div>
          </div>

          {/* <div className='bg-[#f0f3f8] rounded-lg p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-3xl font-bold mb-2'>
                12 Years
              </h3>
              <p className='text-[#4c6290]'>
                We've more than 12 years working experience.
              </p>
            </div>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-3xl font-bold mb-2'>
                100+ Employee
              </h3>
              <p className='text-[#4c6290]'>
                We've more than 100 employees working near you.
              </p>
            </div>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-3xl font-bold mb-2'>
                68 Branches
              </h3>
              <p className='text-[#4c6290]'>
                We have 68 branches across the country and are expanding
              </p>
            </div>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-3xl font-bold mb-2'>
                15 Countries
              </h3>
              <p className='text-[#4c6290]'>
                We are present in 15 countries around the world.
              </p>
            </div>
          </div> */}

          <div className='mb-16'>
            <h2 className='text-[#6b83b6] text-xl mb-2'>Our Vision</h2>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <p className='text-[#4c6290] leading-relaxed'>
                Our Vision is to be the preferred and most trusted supplier of
                tools and mechanical parts, by offering wide variety of
                innovative and reliable products to our customers. We strive to
                consistently exceed our customers' expectations by providing
                exceptional service and expert advice.
              </p>
            </div>
          </div>

          <div className='mb-16'>
            <h2 className='text-[#6b83b6] text-xl mb-2'>Why Us</h2>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <p className='text-[#4c6290] leading-relaxed mb-4'>
                We are dedicated to providing our customers with the best
                possible shopping experience. We understand that our customers
                rely on us for their tools and mechanical parts, and we take
                that responsibility seriously. We carefully select only the best
                products from trusted manufacturers, and we are committed to
                offering competitive prices and fast, reliable shipping.
              </p>
              <p className='text-[#4c6290] leading-relaxed mb-4'>
                Our team of experts is always available to assist you with any
                questions or concerns you may have. We are passionate about the
                products we sell and we have the knowledge and experience to
                help you find exactly what you need.
              </p>
              <p className='text-[#4c6290] leading-relaxed'>
                We are also providing repair service for your tools and
                machinery with professional and experienced technicians. Our
                repair services include troubleshooting, diagnostics, repair,
                and maintenance of tools and machinery.
              </p>
            </div>
          </div>

          <div className='bg-[#f0f3f8] rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-2xl font-bold mb-2'>
                We'd love to hear from you
              </h3>
              <p className='text-[#4c6290]'>Chat with our friendly team</p>
            </div>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-2xl font-bold mb-2'>
                Call us
              </h3>
              <p className='text-[#4c6290]'>Mon-Fri from 8am to 5pm</p>
              <p className='text-[#0e224d] font-medium'>+91 </p>
            </div>
            <div className='text-center'>
              <h3 className='text-[#0e224d] text-2xl font-bold mb-2'>
                Visit us
              </h3>
              <p className='text-[#4c6290]'>Visit our office</p>
              <p className='text-[#4c6290]'>
                205 North Michigan Avenue, Suite 810
                <br />
                Chicago, 60601, USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
