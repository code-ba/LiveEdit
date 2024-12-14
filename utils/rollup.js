// 写个 函数 编译js
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
// 传人 js 字符串和id
export default function rollupJs(input, id) {
    // 写入文件到 public/js/dev/id.js
    const path = `public/js/dev/${id}.js`;
    const output = `public/js/dist/${id}.js`;
    fs.writeFileSync(path, typeof input === 'string' ? input : '');
    // 编译文件
    return rollup({
        input: path,
        plugins: [commonjs(), resolve(), babel(), terser()],
    }).then(bundle => bundle.write(output));
}