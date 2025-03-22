import { breakpoints } from "@/helpers/hooks/useResponsive";
import Link from "next/link";
import styled from "styled-components";

export const NoteWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  color: blue;
  font-weight: bold;
  z-index: 1000;
  @media ${breakpoints.mobile} {
    font-size: 0.8rem;
    background: white;
    z-index: 1000;
  }

  a {
    color: #f2b420 !important;
  }
`;

export default function Note() {
  return (
    <NoteWrap>
      Payments must be made through Zehmizeh. Paying outside violates our Terms
      and is against Halacha.{" "}
      <Link
        href="/terms-of-service#13"
        style={{
          color: "black",
        }}
      >
        View Terms
      </Link>
    </NoteWrap>
  );
}
