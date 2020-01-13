# 从 2.x 迁移到 3.0

- **有影响的改动列表如下：**

|  改动点   | 2.x  | 3.0 |
|  ----  | ----  | ---- |
| 构造函数改为大写  | `new JParticles.particle()` | `new JParticles.Particle()` |
| 目录迁移  | `import JParticles from 'jparticles/production/jparticles'` | `import JParticles from 'jparticles/dist/jparticles'` |


- **应该没有影响的改动点：**
    1. 移除每个特效自身的版本
