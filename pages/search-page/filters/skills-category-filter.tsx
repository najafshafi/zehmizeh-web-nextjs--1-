import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import { getCategoriesApi } from '@/helpers/http/common';
import React, { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { TJobDetails } from '@/helpers/types/job.type';
import useOnClickOutside from '@/helpers/hooks/useClickOutside';
import { Form, Spinner } from 'react-bootstrap';
import Checkbox from '@/components/forms/FilterCheckBox2';
import { SkillAndCategoryFilterWrapper } from './skillAndCategoryStyled';
import { IoMdClose } from 'react-icons/io';

type TSkills = (TJobDetails['skills'][0] & { skills: TJobDetails['skills'] })[];

export const SkillCategoryFilter = () => {
  const { filters, updateFilterHandler, modalOpen, setModalOpen } =
    useSearchFilters();
  const modalRef = useRef<HTMLDivElement>();

  const [allCategories, setAllCategories] = React.useState([]);
  const [allItems, setAllItems] = React.useState<TSkills>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  useOnClickOutside(modalRef, () => {
    if (modalOpen === 'CATEGORIES') setModalOpen('');
  });

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await getCategoriesApi();
      setIsLoading(false);
      if (Array.isArray(data)) setAllCategories(data);
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Failed to load categories';
      if (
        error?.response?.data?.message &&
        typeof error?.response?.data?.message === 'string'
      )
        errorMessage = error.response.data.message;
      else if (error?.message && typeof error.message === 'string')
        errorMessage = error.message;
      else if (error && typeof error === 'string') errorMessage = error;
      toast.error(errorMessage);
    }
  };

  const loadAllCategories = async (keyword = '') => {
    const options = allCategories
      .filter((item) =>
        item?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
      )
      .map((cat) => {
        return {
          category_name: cat.name,
          category_id: cat.id,
        };
      }) as TSkills;
    setAllItems(options);
  };

  useEffect(() => {
    getCategories();
    return () => setModalOpen('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAllCategories(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, allCategories]);

  useEffect(() => {
    if (modalOpen === 'CATEGORIES' && modalRef.current) {
      modalRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }, [modalOpen]);

  const searchUI = () => {
    return (
      <Form.Control
        className="searchbox"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    );
  };

  const checkboxUI = (item: TSkills[0]) => {
    return (
      <Checkbox
        key={`${item.category_name}#${item.category_id}`}
        checked={filters.categories.includes(
          `${item.category_name}#${item.category_id}`
        )}
        toggle={() => {
          const categories = [...(filters?.categories || [])];
          const existIndex = categories.findIndex(
            (prevCategory) =>
              prevCategory === `${item.category_name}#${item.category_id}`
          );
          if (existIndex >= 0) {
            categories.splice(existIndex, 1);
          } else {
            const objectToPush = `${item.category_name}#${item.category_id}`;
            categories.push(objectToPush);
          }
          updateFilterHandler('categories', categories);
        }}
        label={item.category_name}
      />
    );
  };

  const modalUI = () => {
    return (
      <div ref={modalRef} className="modal-wrapper shadow">
        {/* START ----------------------------------------- Search */}
        <div className="modal-search">
          <div>{searchUI()}</div>
          <IoMdClose
            className="pointer ms-2"
            onClick={() => {
              setModalOpen('');
            }}
          />
        </div>
        {/* END ------------------------------------------- Search */}

        {/* START ----------------------------------------- Data to display */}
        <div className="items-ui">
          {allItems?.length > 0 &&
            allItems.map((item) => {
              return checkboxUI(item);
            })}
        </div>
        {/* END ------------------------------------------- Data to display */}

        {/* START ----------------------------------------- Apply and clear button */}
        <div className="button-wrapper">
          <p
            className="text-primary pointer mx-2"
            onClick={() => {
              updateFilterHandler('categories', []);
              setModalOpen('');
            }}
          >
            Clear all
          </p>
        </div>
        {/* END ------------------------------------------- Apply and clear button */}
      </div>
    );
  };

  const dataToDisplay = useMemo(() => {
    if (filters?.categories?.length > 0) {
      return [...allItems].sort((a) =>
        filters.categories.includes(`${a.category_name}#${a.category_id}`)
          ? -1
          : 0
      );
    }
    return [...allItems];
  }, [allItems, filters.categories]);

  return (
    <SkillAndCategoryFilterWrapper
      $isModalOpen={modalOpen === 'CATEGORIES'}
      $type="CATEGORIES"
    >
      {searchUI()}
      {isLoading ? (
        <div>
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <>
          <div>
            {dataToDisplay.slice(0, 5).map((item) => {
              return checkboxUI(item);
            })}
            <p
              className="pointer text-primary m-0 mt-2"
              onClick={() => setModalOpen('CATEGORIES')}
            >
              {allItems.slice(5).length} More
            </p>
          </div>
          {modalUI()}
        </>
      )}
    </SkillAndCategoryFilterWrapper>
  );
};
