```shell
pip install fonttools
fonttools subset "./italics.ttf" --text-file="./reserved-character.txt" --output-file="./italicssm.ttf"
fonttools ttLib.woff2 compress "./italicssm.ttf" -o "./italics.woff2"
```
