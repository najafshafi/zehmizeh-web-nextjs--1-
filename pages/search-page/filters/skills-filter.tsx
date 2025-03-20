import { useEffect, useMemo, useRef, useState } from 'react';
import Checkbox from '@/components/forms/Checkbox';
import { getSkillsApi } from '@/helpers/http/common';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import { TJobDetails } from '@/helpers/types/job.type';
import toast from 'react-hot-toast';
import { getRelevantSkillsBasedOnCategory } from '@/helpers/utils/helper';
import { Form, Spinner } from 'react-bootstrap';
import useOnClickOutside from '@/helpers/hooks/useClickOutside';
import { SkillAndCategoryFilterWrapper } from './skillAndCategoryStyled';
import { IoMdClose } from 'react-icons/io';

type TSkills = (TJobDetails['skills'][0] & { skills: TJobDetails['skills'] })[];

const generateKey = (item) => `${item.skill_name}#${item.skill_id}#${item.category_id}`;

export const SkillFilter = () => {
  const { filters, updateFilterHandler, modalOpen, setModalOpen } = useSearchFilters();

  const [allSkills, setAllSkills] = useState<
    {
      id: number;
      name: string;
      categories: { id: number; name: string }[];
    }[]
  >([]);
  const [allItems, setAllItems] = useState<
    {
      category_id: number;
      category_name: string;
      skills: TSkills;
    }[]
  >([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>();

  useOnClickOutside(modalRef, () => {
    if (modalOpen === 'SKILLS') setModalOpen('');
  });

  const getAllSkillsFromAllCategories = (skills) =>
    getRelevantSkillsBasedOnCategory([
      ...skills,
      ...allSkills.reduce((acc, x) => {
        acc.push(
          ...x.categories
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((y: any) => ({
              category_id: y.id,
              category_name: y.name,
            }))
            .filter((item) => acc.findIndex((item2) => item2.category_id === item.category_id) === -1)
        );
        return acc;
      }, []),
    ]).sort((a, b) => a.category_name.localeCompare(b.category_name));

  const getSkills = async () => {
    try {
      setIsLoading(true);
      const { data } = await getSkillsApi();
      setIsLoading(false);

      if (Array.isArray(data)) setAllSkills(data);
    } catch (error) {
      let errorMessage = 'Failed to load skills';
      if (error?.response?.data?.message && typeof error?.response?.data?.message === 'string')
        errorMessage = error.response.data.message;
      else if (error?.message && typeof error.message === 'string') errorMessage = error.message;
      else if (error && typeof error === 'string') errorMessage = error;
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const loadAllSkills = async (keyword = '') => {
    const skills = allSkills
      .filter((item) => item?.name?.toLowerCase()?.includes(keyword?.toLowerCase()))
      .map((item) => ({
        skill_id: item.id,
        skill_name: item.name,
        categories: item.categories.map((x) => x.id),
      }));
    const relevantSkills: typeof allItems = getRelevantSkillsBasedOnCategory([
      ...skills,
      ...filters.categories.map((category) => ({
        category_id: Number(category.split('#')[1]),
        category_name: category.split('#')[0],
      })),
    ]);
    setAllItems(filters?.categories?.length > 0 ? relevantSkills : getAllSkillsFromAllCategories(skills));
  };

  useEffect(() => {
    getSkills();
    return () => setModalOpen('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAllSkills(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, allSkills, filters.categories]);

  useEffect(() => {
    if (modalOpen === 'SKILLS' && modalRef.current) {
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

  const checkboxUI = (item) => {
    const key = generateKey(item);
    return (
      <Checkbox
        key={key}
        checked={filters.skills.includes(key)}
        toggle={() => {
          const skills = [...filters.skills];
          const existIndex = skills.findIndex((prevCategory) => prevCategory === key);
          if (existIndex >= 0) {
            skills.splice(existIndex, 1);
          } else {
            const objectToPush = key;
            skills.push(objectToPush);
          }
          updateFilterHandler('skills', skills);
        }}
        label={item.skill_name}
      />
    );
  };

  const modalUI = () => {
    const dataToDisplay = allItems.reduce((acc, item) => {
      if (item.category_name && item?.skills?.length > 0) acc.push(item.category_name);
      if (item.skills?.length > 0) {
        acc.push(
          ...item.skills.map((x) => ({
            ...x,
            category_id: item.category_id,
            category_name: item.category_name,
          }))
        );
      }
      return acc;
    }, []);

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
          {dataToDisplay.map((item) => {
            if (typeof item === 'string')
              return (
                <p key={item} className="m-0 my-2 mt-3 font-weight-bold text-capitalize">
                  {item}
                </p>
              );
            return checkboxUI(item);
          })}
        </div>
        {/* END ------------------------------------------- Data to display */}

        {/* START ----------------------------------------- Apply and clear button */}
        <div className="button-wrapper">
          <p
            className="text-primary pointer mx-2"
            onClick={() => {
              updateFilterHandler('skills', []);
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

  const items = [...allItems]
    .map((item) =>
      item.skills.map((x) => ({
        ...x,
        category_id: item.category_id,
        category_name: item.category_name,
      }))
    )
    .flat();

  const dataToDisplay = useMemo(() => {
    if (filters?.skills?.length > 0) {
      return items.sort((a) => (filters.skills.includes(generateKey(a)) ? -1 : 0));
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, filters.skills, filters.categories]);

  return (
    <SkillAndCategoryFilterWrapper $isModalOpen={modalOpen === 'SKILLS'} $type="SKILLS">
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
            <p className="pointer text-primary m-0 mt-2" onClick={() => setModalOpen('SKILLS')}>
              {
                allItems
                  .map((item) => item.skills)
                  .flat()
                  .slice(5).length
              }{' '}
              More
            </p>
          </div>
          {modalUI()}
        </>
      )}
    </SkillAndCategoryFilterWrapper>
  );
};
