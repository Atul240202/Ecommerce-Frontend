import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { CategoryGrid } from '@/components/Home/CategoryGrid';
import { fetchProductCategories, type ProductCategory } from '../services/api';

interface CategoryGroup {
  name: string;
  slug: string;
  subcategories: {
    name: string;
    slug: string;
  }[];
}

export default function MainCategoryPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Fetch categories data
  //   fetch('/tempData/categories.json')
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data.categories));
  // }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(data);

        // Process categories into groups
        const mainCategories = data.filter((cat) => cat.parent === 0);
        const groups: CategoryGroup[] = [];

        mainCategories.forEach((mainCat) => {
          const subcategories = data
            .filter((subCat) => subCat.parent === mainCat.id)
            .map((subCat) => ({
              name: subCat.name,
              slug: subCat.slug,
            }));

          groups.push({
            name: mainCat.name,
            slug: mainCat.slug,
            subcategories,
          });
        });

        setCategoryGroups(groups);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
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
