import styled from 'styled-components';

export const FilterWrapper = styled.div`
  min-width: 270px;
  height: max-content;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .filter__header {
    padding: 1.375rem 1.5rem;
  }
  .filter__header__title {
    line-height: 1.25rem;
  }
  .filter__header__clearbtn {
    line-height: 1rem;
    color: ${(props) => props.theme.colors.lightBlue};
  }
  .filter__checkbox__row {
    color: #4d4d4d;
    line-height: 1.125rem;
    margin-top: 0.875rem;
    .checkbox-label {
      margin-left: 0.75rem;
    }
    .form-check-input[type='radio'] ~ .form-check-label {
      margin-left: 10px;
    }
  }
  .filter__checkbox__row__first {
    color: #4d4d4d;
    line-height: 1.125rem;
    .checkbox-label {
      margin-left: 0.75rem;
    }
  }
`;

export const CategortySkillSelect = {
  control: (base: any) => ({
    ...base,
    height: 50.6,
    marginTop: '1.25rem',
    padding: '0 7px',
    fontSize: '0.875rem',
    fontWeight: 400,
    boxSizing: 'border-box',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    color: '#0067FF',
    ':hover': {
      backgroundColor: 'rgba(209, 229, 255,1)',
    },
  }),
};

export const JobStatusFilter = styled.div`
  margin-top: 1rem;

  .check-filter {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .form-check-label {
    position: relative;
    top: 2px;
  }
`;
