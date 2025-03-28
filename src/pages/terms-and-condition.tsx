import { MainLayout } from '../layouts/MainLayout';
import { Breadcrumb } from '../components/Breadcrumb';

export default function TermsAndConditionsPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Pages', href: '#' },
            { label: 'Terms and Conditions', href: '#' },
          ]}
        />

        <div className='max-w-5xl mx-auto'>
          <h1 className='text-3xl font-bold text-[#0e224d] text-center my-8'>
            Terms and Conditions
          </h1>

          <div className='mb-8 rounded-lg overflow-hidden'>
            <img
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1740596034/vuopqj4a_1_oipydu.png'
              alt='Terms and Conditions'
              width={1000}
              height={400}
              className='w-full h-auto'
            />
          </div>

          <div className='space-y-6'>
            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                1. Introduction
              </h2>
              <p className='text-gray-700 mb-4'>
                At Industrywaala, we are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and disclose
                your personal information when you visit our website or use any
                of our products or services. By accessing or using our website,
                you agree to be bound by this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                2. Personal Information We Collect
              </h2>
              <p className='text-gray-700 mb-4'>
                We may collect personal information from you when you visit our
                website, register an account, place an order, or contact us for
                support. The personal information we collect may include your
                name, email address, phone number, shipping address, and payment
                information.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                3. Use of Your Personal Information
              </h2>
              <p className='text-gray-700 mb-4'>
                We use your personal information to provide you with our
                products or services, process your orders, and communicate with
                you about your account or any issues related to our products or
                services. We may also use your personal information to send you
                promotional materials or special offers.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                4. Disclosure of Your Personal Information
              </h2>
              <p className='text-gray-700 mb-4'>
                We do not sell or rent your personal information to third
                parties. However, we may disclose your personal information to
                our affiliates, service providers, or other third parties as
                necessary to provide you with our products or services or comply
                with applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                5. Security of Your Personal Information
              </h2>
              <p className='text-gray-700 mb-4'>
                We take reasonable measures to protect your personal information
                from unauthorized access, use, or disclosure. We use industry-
                standard encryption technologies to secure your sensitive
                information, such as credit card numbers.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                6. Cookies and Other Tracking Technologies
              </h2>
              <p className='text-gray-700 mb-4'>
                We may use cookies, web beacons, and other tracking technologies
                to collect information about your use of our website or
                services. This information may include your IP address, browser
                type, operating system, and other usage data. We use this
                information to analyze website usage, improve our products or
                services, and personalize your experience on our website.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                7. Children's Privacy
              </h2>
              <p className='text-gray-700 mb-4'>
                Our website and services are not intended for children under the
                age of 18. We do not knowingly collect personal information from
                children under the age of 18.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                8. Changes to this Privacy Policy
              </h2>
              <p className='text-gray-700 mb-4'>
                We reserve the right to modify this Privacy Policy at any time
                without prior notice. Your continued use of our website after
                any such modifications shall constitute your acceptance of the
                revised Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className='text-xl font-semibold text-[#0e224d] mb-3'>
                9. Contact Us
              </h2>
              <p className='text-gray-700 mb-4'>
                If you have any questions or concerns about this Privacy Policy,
                please contact us at{' '}
                <a
                  href='mailto:info@industrywaala.com'
                  className='text-[#4280ef] hover:underline'
                >
                  info@industrywaala.com
                </a>
                .
              </p>
              <p className='text-gray-700'>
                Thank you for choosing Industrywaala!
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
