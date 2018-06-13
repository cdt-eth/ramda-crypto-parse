const R = require('ramda');
const fs = require('fs');

const readFileSync = path => fs.readFileSync(path, { encoding: 'utf-8' });

// prepended "date" & "btc/eth"
const readData = R.pipe(
  R.converge(R.concat, [
    R.pipe(
      R.replace(/.*\//, ''),
      R.replace(/\..*/, ''),
      R.concat('date\t'),
      R.concat(R.__, '\n')
    ),
    readFileSync
  ])
);

// pipe accepts functions and composes them into a single function
// then we pass both paths (data) to the created function
R.pipe(
  R.map(
    R.pipe(
      readData,
      R.split('\n'),
      R.dropLast(1),
      R.map(
        R.pipe(
          R.split('\t'),
          R.view(R.lensIndex(1))
        )
      ),
      R.converge(R.map, [
        R.pipe(
          R.head,
          R.objOf
        ),
        R.tail
      ])
    )
  ),
  R.transpose(),
  R.map(R.mergeAll()),
  console.log
)(['./input/btc.csv', './input/eth.csv']);

//
//
//
//
// TAKES THIS:

// AND GIVES YOU THIS:
// [
//   { btc: '6,905.82', eth: '532.71' },
//   { btc: '6,799.29', eth: '524.86' },
//   { btc: '7,499.55', eth: '594.35' },
//   { btc: '7,632.52', eth: '600.91' },
//   { btc: '7,685.14', eth: '605.44' },
//   { btc: '7,650.82', eth: '607.69' }
// ];
