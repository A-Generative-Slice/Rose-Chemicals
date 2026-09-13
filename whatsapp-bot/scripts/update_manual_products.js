const fs = require('fs');
const path = require('path');

const manualProductsRaw = `
Delux Nice Broom               | 694ac34323d6cfdee781c8f6 | https://rosechemicals.in/products/694ac34323d6cfdee781c8f6
Sitara Broom                   | 694ac34323d6cfdee781c8f8 | https://rosechemicals.in/products/694ac34323d6cfdee781c8f8
Supriya Nice Broom             | 694ac34323d6cfdee781c8fa | https://rosechemicals.in/products/694ac34323d6cfdee781c8fa
Camel Red Broom                | 694ac34323d6cfdee781c8fc | https://rosechemicals.in/products/694ac34323d6cfdee781c8fc
Shine Red Broom                | 694ac34323d6cfdee781c8fe | https://rosechemicals.in/products/694ac34323d6cfdee781c8fe
Pinky Red Broom                | 694ac34323d6cfdee781c900 | https://rosechemicals.in/products/694ac34323d6cfdee781c900
Pinky Blue Broom               | 694ac34323d6cfdee781c902 | https://rosechemicals.in/products/694ac34323d6cfdee781c902
Jumbo Red Broom                | 694ac34323d6cfdee781c904 | https://rosechemicals.in/products/694ac34323d6cfdee781c904
Amil Red Broom                 | 694ac34323d6cfdee781c906 | https://rosechemicals.in/products/694ac34323d6cfdee781c906
Mr. Clean Broom                | 694ac34323d6cfdee781c908 | https://rosechemicals.in/products/694ac34323d6cfdee781c908
Amil Blue Nice Broom           | 694ac34323d6cfdee781c90a | https://rosechemicals.in/products/694ac34323d6cfdee781c90a
Tulsi Green Cover Broom        | 694ac34323d6cfdee781c90c | https://rosechemicals.in/products/694ac34323d6cfdee781c90c
Chennai Broom Set              | 694ac34323d6cfdee781c90e | https://rosechemicals.in/products/694ac34323d6cfdee781c90e
Chennai Burma Cover Broom      | 694ac34323d6cfdee781c910 | https://rosechemicals.in/products/694ac34323d6cfdee781c910
Lady Dream Plastic Broom       | 694ac34323d6cfdee781c912 | https://rosechemicals.in/products/694ac34323d6cfdee781c912
Chennai Burma Plastic Broom    | 694ac34323d6cfdee781c914 | https://rosechemicals.in/products/694ac34323d6cfdee781c914
Lady Dream Soft Brush          | 694ac34323d6cfdee781c916 | https://rosechemicals.in/products/694ac34323d6cfdee781c916
Keetal Toilet Brush            | 694ac34323d6cfdee781c918 | https://rosechemicals.in/products/694ac34323d6cfdee781c918
New Container Toilet Brush     | 694ac34323d6cfdee781c91a | https://rosechemicals.in/products/694ac34323d6cfdee781c91a
THK Toilet Brush               | 694ac34323d6cfdee781c91c | https://rosechemicals.in/products/694ac34323d6cfdee781c91c
Rich Look Single Hockey Small  | 694ac34323d6cfdee781c91e | https://rosechemicals.in/products/694ac34323d6cfdee781c91e
Double Hockey Toilet Brush     | 694ac34323d6cfdee781c920 | https://rosechemicals.in/products/694ac34323d6cfdee781c920
Rich Look Single Hockey Big    | 694ac34323d6cfdee781c922 | https://rosechemicals.in/products/694ac34323d6cfdee781c922
Rich Look Steel Toilet Brush   | 694ac34323d6cfdee781c924 | https://rosechemicals.in/products/694ac34323d6cfdee781c924
Jumbo Double Hockey Toilet Brush | 694ac34323d6cfdee781c926 | https://rosechemicals.in/products/694ac34323d6cfdee781c926
Double Hockey New Model        | 694ac34323d6cfdee781c928 | https://rosechemicals.in/products/694ac34323d6cfdee781c928
Container Brush A              | 694ac34323d6cfdee781c92a | https://rosechemicals.in/products/694ac34323d6cfdee781c92a
Standard Container Brush       | 694ac34323d6cfdee781c92c | https://rosechemicals.in/products/694ac34323d6cfdee781c92c
Double Hockey Jumbo            | 694ac34323d6cfdee781c92e | https://rosechemicals.in/products/694ac34323d6cfdee781c92e
New Carpet Brush               | 694ac34323d6cfdee781c930 | https://rosechemicals.in/products/694ac34323d6cfdee781c930
Avon Carpet Brush              | 694ac34323d6cfdee781c932 | https://rosechemicals.in/products/694ac34323d6cfdee781c932
THK Long Brush 140A            | 694ac34323d6cfdee781c934 | https://rosechemicals.in/products/694ac34323d6cfdee781c934
THK 140 Long Brush             | 694ac34323d6cfdee781c936 | https://rosechemicals.in/products/694ac34323d6cfdee781c936
SPL Hardy Set Big A            | 694ac34323d6cfdee781c938 | https://rosechemicals.in/products/694ac34323d6cfdee781c938
SPL Hardy Set Big Standard     | 694ac34323d6cfdee781c93a | https://rosechemicals.in/products/694ac34323d6cfdee781c93a
SPL Hardy Set                  | 694ac34323d6cfdee781c93c | https://rosechemicals.in/products/694ac34323d6cfdee781c93c
SPL Hardy Set A                | 694ac34323d6cfdee781c93e | https://rosechemicals.in/products/694ac34323d6cfdee781c93e
Gala Static Brush              | 694ac34323d6cfdee781c940 | https://rosechemicals.in/products/694ac34323d6cfdee781c940
Gala Static Brush A            | 694ac34323d6cfdee781c942 | https://rosechemicals.in/products/694ac34323d6cfdee781c942
Lady Dream Soft Brush Set      | 694ac34323d6cfdee781c944 | https://rosechemicals.in/products/694ac34323d6cfdee781c944
Fancy Broom                    | 694ac34323d6cfdee781c946 | https://rosechemicals.in/products/694ac34323d6cfdee781c946
Soft Brush                     | 694ac34323d6cfdee781c948 | https://rosechemicals.in/products/694ac34323d6cfdee781c948
Supreme Sink Square            | 694ac34323d6cfdee781c94a | https://rosechemicals.in/products/694ac34323d6cfdee781c94a
Sink Brush 2381 A              | 694ac34323d6cfdee781c94c | https://rosechemicals.in/products/694ac34323d6cfdee781c94c
Sink Brush 2381                | 694ac34323d6cfdee781c94e | https://rosechemicals.in/products/694ac34323d6cfdee781c94e
Sink Brush 4D Square           | 694ac34323d6cfdee781c950 | https://rosechemicals.in/products/694ac34323d6cfdee781c950
Sink Brush 1807 A              | 694ac34323d6cfdee781c952 | https://rosechemicals.in/products/694ac34323d6cfdee781c952
Sink Brush 1807                | 694ac34323d6cfdee781c954 | https://rosechemicals.in/products/694ac34323d6cfdee781c954
Sink Brush 1103                | 694ac34323d6cfdee781c956 | https://rosechemicals.in/products/694ac34323d6cfdee781c956
New Sink Brush 712             | 694ac34323d6cfdee781c958 | https://rosechemicals.in/products/694ac34323d6cfdee781c958
Neo Sink Brush                 | 694ac34323d6cfdee781c95a | https://rosechemicals.in/products/694ac34323d6cfdee781c95a
Cobweb Sunflower Outer Lock    | 694ac34323d6cfdee781c95c | https://rosechemicals.in/products/694ac34323d6cfdee781c95c
Cobweb Cleaner Flat            | 694ac34323d6cfdee781c95e | https://rosechemicals.in/products/694ac34323d6cfdee781c95e
Cobweb Flat Cleaner            | 694ac34323d6cfdee781c960 | https://rosechemicals.in/products/694ac34323d6cfdee781c960
Cobweb Sunflower Cleaner       | 694ac34323d6cfdee781c962 | https://rosechemicals.in/products/694ac34323d6cfdee781c962
Rose Toilet Bowl Cleaner       | 694ac34323d6cfdee781c964 | https://rosechemicals.in/products/694ac34323d6cfdee781c964
Rose Bathroom Tile Cleaner     | 694ac34323d6cfdee781c966 | https://rosechemicals.in/products/694ac34323d6cfdee781c966
Rose Degreaser Pro             | 694ac34323d6cfdee781c968 | https://rosechemicals.in/products/694ac34323d6cfdee781c968
Rose Dish Wash Liquid          | 694ac34323d6cfdee781c96a | https://rosechemicals.in/products/694ac34323d6cfdee781c96a
Rose Multi-Surface Floor Cleaner | 694ac34323d6cfdee781c96c | https://rosechemicals.in/products/694ac34323d6cfdee781c96c
Rose Crystal Glass Cleaner     | 694ac34323d6cfdee781c96e | https://rosechemicals.in/products/694ac34323d6cfdee781c96e
Acetic Acid                    | 694ac34323d6cfdee781c974 | https://rosechemicals.in/products/694ac34323d6cfdee781c974
cocamidopropyl betaine CAPB    | 694ac34323d6cfdee781c976 | https://rosechemicals.in/products/694ac34323d6cfdee781c976
SUPREME SINK SQUIRE            | 694ac34323d6cfdee781c978 | https://rosechemicals.in/products/694ac34323d6cfdee781c978
MAGIC SPONGE                   | 694ac34323d6cfdee781c97a | https://rosechemicals.in/products/694ac34323d6cfdee781c97a
8201 WHITE IRON BRUSH          | 694ac34323d6cfdee781c97c | https://rosechemicals.in/products/694ac34323d6cfdee781c97c
SUPREEM IRON BRUSH             | 694ac34323d6cfdee781c97e | https://rosechemicals.in/products/694ac34323d6cfdee781c97e
BLACK IRON BRUSH               | 694ac34323d6cfdee781c980 | https://rosechemicals.in/products/694ac34323d6cfdee781c980
SAMARTHYA A1 KITCHEN WIPER     | 694ac34323d6cfdee781c982 | https://rosechemicals.in/products/694ac34323d6cfdee781c982
MURAM WITH BRUSH 109 SMALL     | 694ac34323d6cfdee781c984 | https://rosechemicals.in/products/694ac34323d6cfdee781c984
5500 KEETAL BRUSH              | 694ac34323d6cfdee781c986 | https://rosechemicals.in/products/694ac34323d6cfdee781c986
2381 SINK BRUSH A              | 694ac34323d6cfdee781c988 | https://rosechemicals.in/products/694ac34323d6cfdee781c988
2381 SINK BRUSH                | 694ac34323d6cfdee781c98a | https://rosechemicals.in/products/694ac34323d6cfdee781c98a
MINI DUSTER SPL 43 GM          | 694ac34323d6cfdee781c98c | https://rosechemicals.in/products/694ac34323d6cfdee781c98c
NEW CARPET BRUSH 1511          | 694ac34323d6cfdee781c98e | https://rosechemicals.in/products/694ac34323d6cfdee781c98e
SINK BRUSH 4D SQUARE           | 694ac34323d6cfdee781c990 | https://rosechemicals.in/products/694ac34323d6cfdee781c990
6606 CLOTH BRUSH               | 694ac34323d6cfdee781c992 | https://rosechemicals.in/products/694ac34323d6cfdee781c992
SILVER POLISH                  | 694ac34323d6cfdee781c994 | https://rosechemicals.in/products/694ac34323d6cfdee781c994
METAL POLISH                   | 694ac34323d6cfdee781c996 | https://rosechemicals.in/products/694ac34323d6cfdee781c996
NEW CONTAINER BRUSH 1642       | 694ac34323d6cfdee781c998 | https://rosechemicals.in/products/694ac34323d6cfdee781c998
SINK BRUSH 1807 A              | 694ac34323d6cfdee781c99a | https://rosechemicals.in/products/694ac34323d6cfdee781c99a
SINK BRUSH 1807                | 694ac34323d6cfdee781c99c | https://rosechemicals.in/products/694ac34323d6cfdee781c99c
FRIDGE COVER                   | 694ac34323d6cfdee781c99e | https://rosechemicals.in/products/694ac34323d6cfdee781c99e
THK 1108                       | 694ac34323d6cfdee781c9a0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9a0
THK 140 A                      | 694ac34323d6cfdee781c9a2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9a2
THK 140                        | 694ac34323d6cfdee781c9a4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9a4
METAL PAD                      | 694ac34323d6cfdee781c9a6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9a6
CLEANING TOWEL                 | 694ac34323d6cfdee781c9a8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9a8
HPMC                           | 694ac34323d6cfdee781c9aa | https://rosechemicals.in/products/694ac34323d6cfdee781c9aa
HPMC                           | 694ac34323d6cfdee781c9ac | https://rosechemicals.in/products/694ac34323d6cfdee781c9ac
FEATHER DUSTER SMALL           | 694ac34323d6cfdee781c9ae | https://rosechemicals.in/products/694ac34323d6cfdee781c9ae
FEATHER DUSTER SMALL           | 694ac34323d6cfdee781c9b0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9b0
SN937                          | 694ac34323d6cfdee781c9b2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9b2
SN937                          | 694ac34323d6cfdee781c9b4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9b4
VENUS FLOOR WIPER 18 INCH      | 694ac34323d6cfdee781c9b6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9b6
GLASS WIPER                    | 694ac34323d6cfdee781c9b8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9b8
GLASS WIPERRS26                | 694ac34323d6cfdee781c9ba | https://rosechemicals.in/products/694ac34323d6cfdee781c9ba
IRONMAN 20 INCH WIPER          | 694ac34323d6cfdee781c9bc | https://rosechemicals.in/products/694ac34323d6cfdee781c9bc
GREEN PAD 10X15 (10PCS)        | 694ac34323d6cfdee781c9be | https://rosechemicals.in/products/694ac34323d6cfdee781c9be
CDEA                           | 694ac34323d6cfdee781c9c0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9c0
CDEA                           | 694ac34323d6cfdee781c9c2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9c2
Cocamide Dea Detergent Cdea    | 694ac34323d6cfdee781c9c4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9c4
SS SCRUBBER PATTA              | 694ac34323d6cfdee781c9c6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9c6
SS SCRUBBER PATTA              | 694ac34323d6cfdee781c9c8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9c8
PLASTIC SCRUBBER               | 694ac34323d6cfdee781c9ca | https://rosechemicals.in/products/694ac34323d6cfdee781c9ca
DELUX NICE BROOM               | 694ac34323d6cfdee781c9cc | https://rosechemicals.in/products/694ac34323d6cfdee781c9cc
SITARA BROOM                   | 694ac34323d6cfdee781c9ce | https://rosechemicals.in/products/694ac34323d6cfdee781c9ce
SUPRIYA NICE BROOM             | 694ac34323d6cfdee781c9d0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9d0
CAMEL RED                      | 694ac34323d6cfdee781c9d2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9d2
SHINE RED                      | 694ac34323d6cfdee781c9d4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9d4
ROSANAM                        | 694ac34323d6cfdee781c9d6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9d6
ROSANAM                        | 694ac34323d6cfdee781c9d8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9d8
PINKY RED BROOM                | 694ac34323d6cfdee781c9da | https://rosechemicals.in/products/694ac34323d6cfdee781c9da
PINKY BLUE BROOM               | 694ac34323d6cfdee781c9dc | https://rosechemicals.in/products/694ac34323d6cfdee781c9dc
JUMBO RED BROOM                | 694ac34323d6cfdee781c9de | https://rosechemicals.in/products/694ac34323d6cfdee781c9de
AMIL RED BROOM                 | 694ac34323d6cfdee781c9e0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9e0
MR.CLEAN                       | 694ac34323d6cfdee781c9e2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9e2
AMIL BLUE NICE BROOM           | 694ac34323d6cfdee781c9e4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9e4
TULSI GREEN COVER BROOM        | 694ac34323d6cfdee781c9e6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9e6
chennai burma cover            | 694ac34323d6cfdee781c9e8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9e8
Lady Dream Plastic             | 694ac34323d6cfdee781c9ea | https://rosechemicals.in/products/694ac34323d6cfdee781c9ea
chennai burma plastic          | 694ac34323d6cfdee781c9ec | https://rosechemicals.in/products/694ac34323d6cfdee781c9ec
STP                            | 694ac34323d6cfdee781c9ee | https://rosechemicals.in/products/694ac34323d6cfdee781c9ee
1101 RICH LOOK   TOILET BRUSSINGLE HOCKY SMALL | 694ac34323d6cfdee781c9f0 | https://rosechemicals.in/products/694ac34323d6cfdee781c9f0
1103 SINK BRUSH                | 694ac34323d6cfdee781c9f2 | https://rosechemicals.in/products/694ac34323d6cfdee781c9f2
1103 SINK BRUSH                | 694ac34323d6cfdee781c9f4 | https://rosechemicals.in/products/694ac34323d6cfdee781c9f4
2200 SUNFLOWER SET             | 694ac34323d6cfdee781c9f6 | https://rosechemicals.in/products/694ac34323d6cfdee781c9f6
fancy broom                    | 694ac34323d6cfdee781c9f8 | https://rosechemicals.in/products/694ac34323d6cfdee781c9f8
8226 (1100) TOILET BRUSH DOUBLE HOCKEY | 694ac34323d6cfdee781c9fa | https://rosechemicals.in/products/694ac34323d6cfdee781c9fa
1501 RICH LOOK  TOILET BRUSH SINGLE HOCKY BIG | 694ac34323d6cfdee781c9fc | https://rosechemicals.in/products/694ac34323d6cfdee781c9fc
1010 RICH LOOK STEEL   TOILET BRUSH SINGLE HOCHY SS | 694ac34323d6cfdee781c9fe | https://rosechemicals.in/products/694ac34323d6cfdee781c9fe
3300 JUMBO TOILET BRUSH DOUBLE HOCKY | 694ac34323d6cfdee781ca00 | https://rosechemicals.in/products/694ac34323d6cfdee781ca00
2200 SUNFLOWER SET (SPL) OUTER LOCK | 694ac34323d6cfdee781ca02 | https://rosechemicals.in/products/694ac34323d6cfdee781ca02
2200 SUNFLOWER SET (SPL) OUTER LOCK | 694ac34323d6cfdee781ca04 | https://rosechemicals.in/products/694ac34323d6cfdee781ca04
EXTEND COBWEB SET              | 694ac34323d6cfdee781ca06 | https://rosechemicals.in/products/694ac34323d6cfdee781ca06
EDTA                           | 694ac34323d6cfdee781ca08 | https://rosechemicals.in/products/694ac34323d6cfdee781ca08
GLASS WIPER                    | 694ac34323d6cfdee781ca0a | https://rosechemicals.in/products/694ac34323d6cfdee781ca0a
STPP                           | 694ac34323d6cfdee781ca0c | https://rosechemicals.in/products/694ac34323d6cfdee781ca0c
Glycerine                      | 694ac34323d6cfdee781ca0e | https://rosechemicals.in/products/694ac34323d6cfdee781ca0e
OLEIC ACID                     | 694ac34323d6cfdee781ca10 | https://rosechemicals.in/products/694ac34323d6cfdee781ca10
Acid Slurry                    | 694ac34323d6cfdee781ca12 | https://rosechemicals.in/products/694ac34323d6cfdee781ca12
sodium lauryl ether sulfate SLES 70 | 694ac34323d6cfdee781ca14 | https://rosechemicals.in/products/694ac34323d6cfdee781ca14
9967 SPL HARDY SET BIG A       | 694ac34323d6cfdee781ca16 | https://rosechemicals.in/products/694ac34323d6cfdee781ca16
9967 SPL HARDY SET BIG         | 694ac34323d6cfdee781ca18 | https://rosechemicals.in/products/694ac34323d6cfdee781ca18
9965 SPL HARDY SET             | 694ac34323d6cfdee781ca1a | https://rosechemicals.in/products/694ac34323d6cfdee781ca1a
9965SPL HARDY SET A            | 694ac34323d6cfdee781ca1c | https://rosechemicals.in/products/694ac34323d6cfdee781ca1c
KITCHEN ROLL 45X500            | 694ac34323d6cfdee781ca1e | https://rosechemicals.in/products/694ac34323d6cfdee781ca1e
KITCHEN ROLL 45X500            | 694ac34323d6cfdee781ca20 | https://rosechemicals.in/products/694ac34323d6cfdee781ca20
AVON CARPER BRUSH (307)        | 694ac34323d6cfdee781ca22 | https://rosechemicals.in/products/694ac34323d6cfdee781ca22
GALA STATIC BRUSH              | 694ac34323d6cfdee781ca24 | https://rosechemicals.in/products/694ac34323d6cfdee781ca24
GALA STATIS BRUSH A            | 694ac34323d6cfdee781ca26 | https://rosechemicals.in/products/694ac34323d6cfdee781ca26
8851 DOUBLE HOCKEY NEW MODAL   | 694ac34323d6cfdee781ca28 | https://rosechemicals.in/products/694ac34323d6cfdee781ca28
FAN BROOM SPL                  | 694ac34323d6cfdee781ca2a | https://rosechemicals.in/products/694ac34323d6cfdee781ca2a
Fan broom                      | 694ac34323d6cfdee781ca2c | https://rosechemicals.in/products/694ac34323d6cfdee781ca2c
3008 GLASS WIPER               | 694ac34323d6cfdee781ca2e | https://rosechemicals.in/products/694ac34323d6cfdee781ca2e
Glass Wiper                    | 694ac34323d6cfdee781ca30 | https://rosechemicals.in/products/694ac34323d6cfdee781ca30
WINDOW WIPER                   | 694ac34323d6cfdee781ca32 | https://rosechemicals.in/products/694ac34323d6cfdee781ca32
Window Wiper                   | 694ac34323d6cfdee781ca34 | https://rosechemicals.in/products/694ac34323d6cfdee781ca34
Micro Cup 160gm                | 694ac34323d6cfdee781ca36 | https://rosechemicals.in/products/694ac34323d6cfdee781ca36
NCB 4060 MICRO CUP 160 GM      | 694ac34323d6cfdee781ca38 | https://rosechemicals.in/products/694ac34323d6cfdee781ca38
Acid Thickener                 | 694ac34323d6cfdee781ca3a | https://rosechemicals.in/products/694ac34323d6cfdee781ca3a
Micro SS Round 215 gm          | 694ac34323d6cfdee781ca3c | https://rosechemicals.in/products/694ac34323d6cfdee781ca3c
ZH 09 13 MICRO SSROUND FD 215 GM | 694ac34323d6cfdee781ca3e | https://rosechemicals.in/products/694ac34323d6cfdee781ca3e
8312 CONTAINER BRUSH A         | 694ac34323d6cfdee781ca40 | https://rosechemicals.in/products/694ac34323d6cfdee781ca40
8312 CONTAINER BRUSH           | 694ac34323d6cfdee781ca42 | https://rosechemicals.in/products/694ac34323d6cfdee781ca42
SAMARTHYA MURAM                | 694ac34323d6cfdee781ca44 | https://rosechemicals.in/products/694ac34323d6cfdee781ca44
MURAM SPECIAL                  | 694ac34323d6cfdee781ca46 | https://rosechemicals.in/products/694ac34323d6cfdee781ca46
MURAM SADA BIG                 | 694ac34323d6cfdee781ca48 | https://rosechemicals.in/products/694ac34323d6cfdee781ca48
MURAM SMALL SADA               | 694ac34323d6cfdee781ca4a | https://rosechemicals.in/products/694ac34323d6cfdee781ca4a
FABLAS KITCHEN ROLL            | 694ac34323d6cfdee781ca4c | https://rosechemicals.in/products/694ac34323d6cfdee781ca4c
712 NEW SINK BRUSH             | 694ac34323d6cfdee781ca4e | https://rosechemicals.in/products/694ac34323d6cfdee781ca4e
Z 12 MICRO GLOVES              | 694ac34323d6cfdee781ca50 | https://rosechemicals.in/products/694ac34323d6cfdee781ca50
NEO SINK BRUSH                 | 694ac34323d6cfdee781ca52 | https://rosechemicals.in/products/694ac34323d6cfdee781ca52
DODIE MOP                      | 694ac34323d6cfdee781ca54 | https://rosechemicals.in/products/694ac34323d6cfdee781ca54
I MOP                          | 694ac34323d6cfdee781ca56 | https://rosechemicals.in/products/694ac34323d6cfdee781ca56
I MOP                          | 694ac34323d6cfdee781ca58 | https://rosechemicals.in/products/694ac34323d6cfdee781ca58
LADY DREAM softbrush set       | 694ac34323d6cfdee781ca74 | https://rosechemicals.in/products/694ac34323d6cfdee781ca74
MEXICAN                        | 694ac34323d6cfdee781ca76 | https://rosechemicals.in/products/694ac34323d6cfdee781ca76
STAINLESS STEEL   MOP          | 694ac34323d6cfdee781ca78 | https://rosechemicals.in/products/694ac34323d6cfdee781ca78
TWIST MOP SS                   | 694ac34323d6cfdee781ca7a | https://rosechemicals.in/products/694ac34323d6cfdee781ca7a
cobweb flat                    | 694ac34323d6cfdee781ca7c | https://rosechemicals.in/products/694ac34323d6cfdee781ca7c
cobweb sunflower               | 694ac34323d6cfdee781ca7e | https://rosechemicals.in/products/694ac34323d6cfdee781ca7e
fancy broom                    | 694ac34323d6cfdee781ca80 | https://rosechemicals.in/products/694ac34323d6cfdee781ca80
kitchen wiper                  | 694ac34323d6cfdee781ca82 | https://rosechemicals.in/products/694ac34323d6cfdee781ca82
lady dream soft brush          | 694ac34323d6cfdee781ca84 | https://rosechemicals.in/products/694ac34323d6cfdee781ca84
londonmop                      | 694ac34323d6cfdee781ca86 | https://rosechemicals.in/products/694ac34323d6cfdee781ca86
mate 1                         | 694ac34323d6cfdee781ca88 | https://rosechemicals.in/products/694ac34323d6cfdee781ca88
mate 2                         | 694ac34323d6cfdee781ca8a | https://rosechemicals.in/products/694ac34323d6cfdee781ca8a
soft brush                     | 694ac34323d6cfdee781ca8c | https://rosechemicals.in/products/694ac34323d6cfdee781ca8c
spanish                        | 694ac34323d6cfdee781ca8e | https://rosechemicals.in/products/694ac34323d6cfdee781ca8e
twist mop colour a             | 694ac34323d6cfdee781ca90 | https://rosechemicals.in/products/694ac34323d6cfdee781ca90
whitemop                       | 694ac34323d6cfdee781ca92 | https://rosechemicals.in/products/694ac34323d6cfdee781ca92
shampoo                        | 69537ad322fed516e4260f10 | https://rosechemicals.in/products/69537ad322fed516e4260f10
SUPERMOP                       | 6953bcb97c0098d922c76f0c | https://rosechemicals.in/products/6953bcb97c0098d922c76f0c
retro broom                    | 6953c0957c0098d922c77040 | https://rosechemicals.in/products/6953c0957c0098d922c77040
apple broom                    | 6954ddc4b4497cb37f141c5c | https://rosechemicals.in/products/6954ddc4b4497cb37f141c5c
`;

const productsPath = path.join(__dirname, '../products.json');
let productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const manualProducts = manualProductsRaw.trim().split('\n').map(line => {
    const [name, id, link] = line.split('|').map(s => s.trim());
    return {
        id,
        name,
        link,
        mrp: 0, // We'll try to find existing price or default to 0
        category: "Manual",
        source: "manual_list"
    };
});

// Update or Add
manualProducts.forEach(mp => {
    const existingIndex = productsData.products.findIndex(p => p.id === mp.id || p.name.toLowerCase() === mp.name.toLowerCase());
    if (existingIndex !== -1) {
        // preserve existing metadata like mrp if it exists
        const old = productsData.products[existingIndex];
        productsData.products[existingIndex] = { ...old, ...mp, mrp: old.mrp || 0 };
    } else {
        productsData.products.push(mp);
    }
});

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
console.log(`✅ Updated ${manualProducts.length} manual products!`);
