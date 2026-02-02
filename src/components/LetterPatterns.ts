// Comprehensive letter recognition patterns for all 26 English letters
// Each pattern analyzes path characteristics to identify letters

interface Point {
  x: number;
  y: number;
  timestamp: number;
}

interface LetterPattern {
  name: string;
  check: (path: Point[], normalized: Point[], width: number, height: number) => number;
}

// Helper functions
const calculateAspectRatio = (width: number, height: number): number => {
  return width / (height || 1);
};

const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const calculateCurvature = (normalized: Point[]): number => {
  let curvature = 0;
  for (let i = 1; i < normalized.length - 1; i++) {
    const angle1 = Math.atan2(normalized[i].y - normalized[i - 1].y, normalized[i].x - normalized[i - 1].x);
    const angle2 = Math.atan2(normalized[i + 1].y - normalized[i].y, normalized[i + 1].x - normalized[i].x);
    curvature += Math.abs(angle2 - angle1);
  }
  return curvature;
};



export const LETTER_PATTERNS: LetterPattern[] = [
  // A - Triangle shape with horizontal line
  {
    name: 'A',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);
      const secondThird = path.slice(third, third * 2);
      const lastThird = path.slice(third * 2);

      const topDown = firstThird[firstThird.length - 1].y > firstThird[0].y;
      const midHorizontal = Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) >
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y);
      const bottomUp = lastThird[lastThird.length - 1].y < lastThird[0].y;

      return (topDown && midHorizontal && bottomUp) ? 0.75 : 0;
    }
  },

  // B - Two loops or curved segments
  {
    name: 'B',
    check: (path, normalized, width, height) => {
      if (path.length < 25) return 0;
      const mid = Math.floor(path.length / 2);
      const firstHalf = normalized.slice(0, mid);
      const secondHalf = normalized.slice(mid);

      const curvature1 = calculateCurvature(firstHalf);
      const curvature2 = calculateCurvature(secondHalf);
      const aspectRatio = calculateAspectRatio(width, height);

      return (curvature1 > Math.PI * 0.8 && curvature2 > Math.PI * 0.8 && aspectRatio > 0.5 && aspectRatio < 1.2) ? 0.7 : 0;
    }
  },

  // C - Open curve
  {
    name: 'C',
    check: (_path, normalized, _width, _height) => {
      const start = normalized[0];
      const end = normalized[normalized.length - 1];
      const distance = calculateDistance(start, end);
      const curvature = calculateCurvature(normalized);

      return (curvature > Math.PI && curvature < Math.PI * 1.8 && distance > 0.4) ? 0.85 : 0;
    }
  },

  // D - Vertical line with curve
  {
    name: 'D',
    check: (path, normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const mid = Math.floor(path.length / 2);
      const firstHalf = path.slice(0, mid);
      const secondHalf = normalized.slice(mid);

      const firstVertical = Math.abs(firstHalf[firstHalf.length - 1].y - firstHalf[0].y) >
        Math.abs(firstHalf[firstHalf.length - 1].x - firstHalf[0].x);
      const secondCurve = calculateCurvature(secondHalf) > Math.PI * 0.7;

      return (firstVertical && secondCurve) ? 0.75 : 0;
    }
  },

  // E - Horizontal line with three vertical segments
  {
    name: 'E',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const quarter = Math.floor(path.length / 4);
      const segments = [
        path.slice(0, quarter),
        path.slice(quarter, quarter * 2),
        path.slice(quarter * 2, quarter * 3),
        path.slice(quarter * 3)
      ];

      let horizontalCount = 0;
      let verticalCount = 0;

      segments.forEach(seg => {
        const dx = Math.abs(seg[seg.length - 1].x - seg[0].x);
        const dy = Math.abs(seg[seg.length - 1].y - seg[0].y);
        if (dx > dy * 1.5) horizontalCount++;
        if (dy > dx * 1.5) verticalCount++;
      });

      return (horizontalCount >= 2 && verticalCount >= 2) ? 0.7 : 0;
    }
  },

  // F - Vertical line with two horizontal segments
  {
    name: 'F',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 15) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);
      const secondThird = path.slice(third, third * 2);

      const firstVertical = Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) >
        Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x);
      const secondHorizontal = Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) >
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y);

      return (firstVertical && secondHorizontal) ? 0.75 : 0;
    }
  },

  // G - C with horizontal line at bottom
  {
    name: 'G',
    check: (path, normalized, _width, _height) => {
      if (path.length < 25) return 0;
      const lastThird = normalized.slice(Math.floor(normalized.length * 2 / 3));
      const curvature = calculateCurvature(normalized.slice(0, Math.floor(normalized.length * 2 / 3)));
      const horizontalLine = Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) >
        Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) * 2;

      return (curvature > Math.PI * 0.8 && horizontalLine) ? 0.7 : 0;
    }
  },

  // H - Two vertical lines with horizontal connector
  {
    name: 'H',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const third = Math.floor(path.length / 3);
      const segments = [path.slice(0, third), path.slice(third, third * 2), path.slice(third * 2)];

      const vertical1 = Math.abs(segments[0][segments[0].length - 1].y - segments[0][0].y) >
        Math.abs(segments[0][segments[0].length - 1].x - segments[0][0].x) * 2;
      const horizontal = Math.abs(segments[1][segments[1].length - 1].x - segments[1][0].x) >
        Math.abs(segments[1][segments[1].length - 1].y - segments[1][0].y) * 2;
      const vertical2 = Math.abs(segments[2][segments[2].length - 1].y - segments[2][0].y) >
        Math.abs(segments[2][segments[2].length - 1].x - segments[2][0].x) * 2;

      return (vertical1 && horizontal && vertical2) ? 0.8 : 0;
    }
  },

  // I - Vertical line
  {
    name: 'I',
    check: (path, normalized, width, height) => {
      const aspectRatio = calculateAspectRatio(width, height);
      return (aspectRatio < 0.3 && width < 30) ? 0.9 : 0;
    }
  },

  // J - Hook shape
  {
    name: 'J',
    check: (path, normalized, _width, _height) => {
      if (path.length < 15) return 0;
      const lastThird = normalized.slice(Math.floor(normalized.length * 2 / 3));
      const firstTwoThirds = path.slice(0, Math.floor(path.length * 2 / 3));

      const vertical = Math.abs(firstTwoThirds[firstTwoThirds.length - 1].y - firstTwoThirds[0].y) >
        Math.abs(firstTwoThirds[firstTwoThirds.length - 1].x - firstTwoThirds[0].x) * 2;
      const hook = calculateCurvature(lastThird) > Math.PI * 0.5;

      return (vertical && hook) ? 0.75 : 0;
    }
  },

  // K - Vertical line with two diagonal lines
  {
    name: 'K',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 18) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);
      const secondThird = path.slice(third, third * 2);
      const lastThird = path.slice(third * 2);

      const vertical = Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) >
        Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x) * 2;
      const diag1 = Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) > 0 &&
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y) > 0 &&
        Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) /
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y) > 0.5;
      const diag2 = Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) > 0 &&
        Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) > 0 &&
        Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) /
        Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) > 0.5;

      return (vertical && (diag1 || diag2)) ? 0.7 : 0;
    }
  },

  // L - Vertical then horizontal
  {
    name: 'L',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 15) return 0;
      const midPoint = Math.floor(path.length / 2);
      const firstHalf = path.slice(0, midPoint);
      const secondHalf = path.slice(midPoint);

      const firstHeight = Math.abs(firstHalf[firstHalf.length - 1].y - firstHalf[0].y);
      const firstWidth = Math.abs(firstHalf[firstHalf.length - 1].x - firstHalf[0].x);
      const secondWidth = Math.abs(secondHalf[secondHalf.length - 1].x - secondHalf[0].x);
      const secondHeight = Math.abs(secondHalf[secondHalf.length - 1].y - secondHalf[0].y);

      return (firstHeight > firstWidth * 2 && secondWidth > secondHeight * 2) ? 0.85 : 0;
    }
  },

  // M - Two diagonal lines meeting in middle
  {
    name: 'M',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const quarter = Math.floor(path.length / 4);
      const segments = [
        path.slice(0, quarter),
        path.slice(quarter, quarter * 2),
        path.slice(quarter * 2, quarter * 3),
        path.slice(quarter * 3)
      ];

      const down1 = segments[0][segments[0].length - 1].y > segments[0][0].y;
      const up1 = segments[1][segments[1].length - 1].y < segments[1][0].y;
      const down2 = segments[2][segments[2].length - 1].y > segments[2][0].y;
      const up2 = segments[3][segments[3].length - 1].y < segments[3][0].y;

      return ((down1 && up1) || (down2 && up2)) && (down1 || down2) && (up1 || up2) ? 0.75 : 0;
    }
  },

  // N - Two vertical lines with diagonal connector
  {
    name: 'N',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 18) return 0;
      const third = Math.floor(path.length / 3);
      const segments = [path.slice(0, third), path.slice(third, third * 2), path.slice(third * 2)];

      const vertical1 = Math.abs(segments[0][segments[0].length - 1].y - segments[0][0].y) >
        Math.abs(segments[0][segments[0].length - 1].x - segments[0][0].x) * 2;
      const diagonal = Math.abs(segments[1][segments[1].length - 1].x - segments[1][0].x) > 0 &&
        Math.abs(segments[1][segments[1].length - 1].y - segments[1][0].y) > 0;
      const vertical2 = Math.abs(segments[2][segments[2].length - 1].y - segments[2][0].y) >
        Math.abs(segments[2][segments[2].length - 1].x - segments[2][0].x) * 2;

      return (vertical1 && diagonal && vertical2) ? 0.8 : 0;
    }
  },

  // O - Closed circle/oval
  {
    name: 'O',
    check: (path, normalized, width, height) => {
      const start = normalized[0];
      const end = normalized[normalized.length - 1];
      const distance = calculateDistance(start, end);
      const aspectRatio = calculateAspectRatio(width, height);
      const curvature = calculateCurvature(normalized);

      return (distance < 0.3 && curvature > Math.PI * 1.5 && aspectRatio > 0.7 && aspectRatio < 1.3) ? 0.9 : 0;
    }
  },

  // P - Vertical line with loop at top
  {
    name: 'P',
    check: (path, normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const mid = Math.floor(path.length / 2);
      const firstHalf = path.slice(0, mid);
      const secondHalf = normalized.slice(mid);

      const vertical = Math.abs(firstHalf[firstHalf.length - 1].y - firstHalf[0].y) >
        Math.abs(firstHalf[firstHalf.length - 1].x - firstHalf[0].x) * 2;
      const loop = calculateCurvature(secondHalf) > Math.PI * 0.7;

      return (vertical && loop) ? 0.75 : 0;
    }
  },

  // Q - O with tail
  {
    name: 'Q',
    check: (path, normalized, _width, _height) => {
      if (path.length < 25) return 0;
      const lastThird = normalized.slice(Math.floor(normalized.length * 2 / 3));
      const firstTwoThirds = normalized.slice(0, Math.floor(normalized.length * 2 / 3));

      const start = firstTwoThirds[0];
      const end = firstTwoThirds[firstTwoThirds.length - 1];
      const distance = calculateDistance(start, end);
      const curvature = calculateCurvature(firstTwoThirds);
      const tail = lastThird.length > 3 && calculateDistance(lastThird[0], lastThird[lastThird.length - 1]) > 0.15;

      return (distance < 0.3 && curvature > Math.PI * 1.2 && tail) ? 0.7 : 0;
    }
  },

  // R - P with diagonal line
  {
    name: 'R',
    check: (path, normalized, _width, _height) => {
      if (path.length < 22) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);

      const lastThird = path.slice(third * 2);

      const vertical = Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) >
        Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x) * 2;
      const loop = calculateCurvature(normalized.slice(third, third * 2)) > Math.PI * 0.6;
      const diagonal = Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) > 0 &&
        Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) > 0;

      return (vertical && loop && diagonal) ? 0.7 : 0;
    }
  },

  // S - S-shaped curve
  {
    name: 'S',
    check: (path, normalized, width, height) => {
      if (path.length < 20) return 0;
      const mid = Math.floor(normalized.length / 2);
      const firstHalf = normalized.slice(0, mid);
      const secondHalf = normalized.slice(mid);

      const curvature1 = calculateCurvature(firstHalf);
      const curvature2 = calculateCurvature(secondHalf);
      const aspectRatio = calculateAspectRatio(width, height);

      return (curvature1 > Math.PI * 0.5 && curvature2 > Math.PI * 0.5 && aspectRatio > 0.8) ? 0.75 : 0;
    }
  },

  // T - Horizontal line over vertical line
  {
    name: 'T',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 12) return 0;
      const firstThird = path.slice(0, Math.floor(path.length / 3));
      const lastTwoThirds = path.slice(Math.floor(path.length / 3));

      const firstHorizontal = Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x) >
        Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) * 2;
      const lastVertical = Math.abs(lastTwoThirds[lastTwoThirds.length - 1].y - lastTwoThirds[0].y) >
        Math.abs(lastTwoThirds[lastTwoThirds.length - 1].x - lastTwoThirds[0].x) * 2;

      return (firstHorizontal && lastVertical) ? 0.85 : 0;
    }
  },

  // U - U-shaped curve
  {
    name: 'U',
    check: (_path, normalized, _width, _height) => {
      const start = normalized[0];
      const end = normalized[normalized.length - 1];
      const distance = calculateDistance(start, end);
      const curvature = calculateCurvature(normalized);

      return (distance < 0.2 && curvature > Math.PI * 0.8) ? 0.8 : 0;
    }
  },

  // V - Diagonal lines meeting at bottom
  {
    name: 'V',
    check: (path, normalized, _width, _height) => {
      if (path.length < 10) return 0;
      const midIndex = Math.floor(path.length / 2);
      const firstHalf = normalized.slice(0, midIndex);
      const secondHalf = normalized.slice(midIndex);

      const firstSlope = (firstHalf[firstHalf.length - 1].y - firstHalf[0].y) /
        ((firstHalf[firstHalf.length - 1].x - firstHalf[0].x) || 0.001);
      const secondSlope = (secondHalf[secondHalf.length - 1].y - secondHalf[0].y) /
        ((secondHalf[secondHalf.length - 1].x - secondHalf[0].x) || 0.001);

      return (firstSlope > 0.5 && secondSlope < -0.5) ? 0.8 : 0;
    }
  },

  // W - Two V shapes connected
  {
    name: 'W',
    check: (path, normalized, _width, _height) => {
      if (path.length < 20) return 0;
      const quarter = Math.floor(path.length / 4);
      const segments = [
        path.slice(0, quarter),
        path.slice(quarter, quarter * 2),
        path.slice(quarter * 2, quarter * 3),
        path.slice(quarter * 3)
      ];

      let vShapes = 0;
      for (let i = 0; i < segments.length - 1; i++) {
        const seg1 = normalized.slice(i * quarter, (i + 1) * quarter);
        const seg2 = normalized.slice((i + 1) * quarter, (i + 2) * quarter);
        if (seg1.length > 0 && seg2.length > 0) {
          const slope1 = (seg1[seg1.length - 1].y - seg1[0].y) / ((seg1[seg1.length - 1].x - seg1[0].x) || 0.001);
          const slope2 = (seg2[seg2.length - 1].y - seg2[0].y) / ((seg2[seg2.length - 1].x - seg2[0].x) || 0.001);
          if ((slope1 > 0.3 && slope2 < -0.3) || (slope1 < -0.3 && slope2 > 0.3)) {
            vShapes++;
          }
        }
      }

      return vShapes >= 2 ? 0.7 : 0;
    }
  },

  // X - Two crossing diagonal lines
  {
    name: 'X',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 15) return 0;
      const mid = Math.floor(path.length / 2);
      const firstHalf = path.slice(0, mid);
      const secondHalf = path.slice(mid);

      const diag1 = Math.abs(firstHalf[firstHalf.length - 1].x - firstHalf[0].x) > 0 &&
        Math.abs(firstHalf[firstHalf.length - 1].y - firstHalf[0].y) > 0;
      const diag2 = Math.abs(secondHalf[secondHalf.length - 1].x - secondHalf[0].x) > 0 &&
        Math.abs(secondHalf[secondHalf.length - 1].y - secondHalf[0].y) > 0;

      const slope1 = (firstHalf[firstHalf.length - 1].y - firstHalf[0].y) /
        ((firstHalf[firstHalf.length - 1].x - firstHalf[0].x) || 0.001);
      const slope2 = (secondHalf[secondHalf.length - 1].y - secondHalf[0].y) /
        ((secondHalf[secondHalf.length - 1].x - secondHalf[0].x) || 0.001);

      return (diag1 && diag2 && Math.abs(slope1 + slope2) < 2) ? 0.75 : 0;
    }
  },

  // Y - Two diagonal lines meeting one vertical
  {
    name: 'Y',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 18) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);
      const secondThird = path.slice(third, third * 2);
      const lastThird = path.slice(third * 2);

      const diag1 = Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x) > 0 &&
        Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) > 0;
      const diag2 = Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) > 0 &&
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y) > 0;
      const vertical = Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) >
        Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) * 2;

      return (diag1 && diag2 && vertical) ? 0.7 : 0;
    }
  },

  // Z - Horizontal, diagonal, horizontal
  {
    name: 'Z',
    check: (path, _normalized, _width, _height) => {
      if (path.length < 18) return 0;
      const third = Math.floor(path.length / 3);
      const firstThird = path.slice(0, third);
      const secondThird = path.slice(third, third * 2);
      const lastThird = path.slice(third * 2);

      const horizontal1 = Math.abs(firstThird[firstThird.length - 1].x - firstThird[0].x) >
        Math.abs(firstThird[firstThird.length - 1].y - firstThird[0].y) * 2;
      const diagonal = Math.abs(secondThird[secondThird.length - 1].x - secondThird[0].x) > 0 &&
        Math.abs(secondThird[secondThird.length - 1].y - secondThird[0].y) > 0;
      const horizontal2 = Math.abs(lastThird[lastThird.length - 1].x - lastThird[0].x) >
        Math.abs(lastThird[lastThird.length - 1].y - lastThird[0].y) * 2;

      return (horizontal1 && diagonal && horizontal2) ? 0.8 : 0;
    }
  },

  // Space/dash - horizontal line
  {
    name: '-',
    check: (path, normalized, width, height) => {
      const aspectRatio = calculateAspectRatio(width, height);
      return (aspectRatio > 3 && height < 30) ? 0.9 : 0;
    }
  }
];

