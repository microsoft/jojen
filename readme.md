# Jojen [![Build Status](https://travis-ci.org/WatchBeam/jojen.svg?branch=master)](https://travis-ci.org/WatchBeam/jojen)

Jojen is an updated take on [Joi](https://github.com/hapijs/joi)'s API. Joi has a very pleasant and fluent API, however it suffers from relatively poor performance, lacks language support, doesn't allow user-defined validation functions, and doesn't work well in a Browserify/Webpack frontend.

Jojens goals are to:
 - Mostly match the Joi API with very few inconsistencies (see [compatibility](https://github.com/WatchBeam/jojen/blob/master/compatibility.md))
 - Fixes the inconsistent parts of Joi (again, see [compatibility](https://github.com/WatchBeam/jojen/blob/master/compatibility.md))
 - Perform reasonably well (at least 18x faster than Joi in all cases, see [bench output](https://github.com/WatchBeam/jojen/blob/master/bench.txt)) in a reasonably small package (currently 13.5 KB)
 - Support browsers, user-defined validations, and internationalisation.
