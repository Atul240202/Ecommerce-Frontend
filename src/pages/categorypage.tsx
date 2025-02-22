import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { CategoryGrid } from '@/components/Home/CategoryGrid';

export default function MainCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories data
    fetch('/tempData/categories.json')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);

  if (!categories.length) {
    return <div></div>; // You can add a loading spinner here
  }

  return (
    <MainLayout>
      <div className='container ml-[5%] px-2 w-[90%]'>
        <CategoryGrid categories={categories} />
      </div>
    </MainLayout>
  );
}
