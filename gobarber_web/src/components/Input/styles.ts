import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isField: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;


  border: 2px solid #232129;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${(props) => props.isFocused && css`
    color: #FF9000;
    border-color: #FF9000;
  `}

  ${(props) => props.isField && css`
    color: #FF9000;
  `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px #232129 inset !important;
      box-shadow: 0 0 0 30px #232129 inset;
      -webkit-text-fill-color: #f4ede8 !important;
    }

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;
