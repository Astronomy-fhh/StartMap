export function getZoomLevel(maxDiff) {
  if (maxDiff <= 0.0005) {
    return 21;
  }
  if (maxDiff <= 0.001) {
    return 20;
  }
  if (maxDiff <= 0.002) {
    return 19;
  }
  if (maxDiff <= 0.005) {
    return 18;
  }
  if (maxDiff <= 0.01) {
    return 17;
  }
  if (maxDiff <= 0.02) {
    return 16;
  }
  if (maxDiff <= 0.05) {
    return 15;
  }
  if (maxDiff <= 0.1) {
    return 14;
  }
  if (maxDiff <= 0.2) {
    return 13;
  }
  if (maxDiff <= 0.5) {
    return 12;
  }
  if (maxDiff <= 1) {
    return 11;
  }
  if (maxDiff <= 2) {
    return 10;
  }
  if (maxDiff <= 5) {
    return 9;
  }
  if (maxDiff <= 10) {
    return 8;
  }
  if (maxDiff <= 20) {
    return 7;
  }
  if (maxDiff <= 50) {
    return 6;
  }
  if (maxDiff <= 100) {
    return 5;
  }
  if (maxDiff <= 200) {
    return 4;
  }
  if (maxDiff <= 500) {
    return 3;
  }
  return 2;
}
