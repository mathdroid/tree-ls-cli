import dt from 'directory-tree';
import * as path from 'path';

const SYMBOLS = Object.freeze({
  BRANCH: '├── ',
  EMPTY: '',
  INDENT: '    ',
  LAST_BRANCH: '└── ',
  VERTICAL: '│   ',
});

const printNode = (
  tree: dt.DirectoryTree,
  depth = 0,
  precedingSymbols: string,
  isLast = false
) => {
  const lines: string[] = [];

  // if (tree.children) {
  //   tree.children.forEach(childTree => {
  //     printNode(childTree, depth + 1);
  //   });
  // }

  const line = [precedingSymbols];
  if (depth >= 1) {
    line.push(isLast ? SYMBOLS.LAST_BRANCH : SYMBOLS.BRANCH);
  }
  line.push(`${tree.name} (${tree.size} B)`);
  lines.push(line.join(''));

  if (!tree.children) {
    return lines;
  } else {
    tree.children.forEach((content, index, children) => {
      const isCurrentLast = index === children.length - 1;
      const linesForFile = printNode(
        content,
        depth + 1,
        precedingSymbols +
          (depth >= 1
            ? isLast
              ? SYMBOLS.INDENT
              : SYMBOLS.VERTICAL
            : SYMBOLS.EMPTY),
        isCurrentLast
      );
      lines.push.apply(lines, linesForFile);
    });
    return lines;
  }
};

export default () => {
  const target = process.argv[2] || './';
  const resolved = path.resolve('./', target);
  const tree = dt(resolved);
  console.log(printNode(tree, 0, '').join('\n'));
};
