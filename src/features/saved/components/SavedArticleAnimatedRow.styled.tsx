import styled from 'styled-components/native';

/** Clips the row while it translates so siblings don't repaint underneath. */
export const RowClip = styled.View`
  width: 100%;
  overflow: hidden;
`;
