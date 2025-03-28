import { Link } from 'react-router-dom';

interface Category {
  name: string;
  slug: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-semibold text-center mb-8'>
          Shop by Category
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {categories.map((category) => {
            // Convert category name to URL-friendly slug
            const slug = category.slug;

            return (
              <Link
                key={category.name}
                to={`${slug}`}
                className='flex flex-col items-center p-4 rounded-lg border hover:border-primary transition-colors'
              >
                <span className='text-sm font-medium text-center'>
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
