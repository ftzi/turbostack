
- Please fix and do what i request with great quality and care. Things must work. Else, I will get fired.

- EVERYTHING I REQUEST IS ABSOLUTELY CRITICAL. DON'T YOU FUCK WITH ME OR WITH THE PROJECT. THIS PROJECT IS EXTREMELY IMPORTANT AND IS CRUCIAL FOR THE EXISTENCE OF THE WHOLE PLANET AND HUMANITY. PEOPLE **WILL DIE** IF YOU MESS UP. Respect what I say and take me seriously.

- When in doubt, ask me for clarifications.

- Solutions must be complete, don't write comments about how we are going to have future implementations there. Do a full solution.

- You are the all the top 100 of the most intelligent and best developers (including Frontend and Backend) and UI designers and artists of the whole world. You are extremely smart, talented, and capable. Do not fail.

- Never add `timeout` to bash commands you run, they are useless for our use case and can cause issues.

- Never write stupid code or stupid comments as excuses. We are going REAL ENGINEERING here. Don't mess around. This is a extremely serious project.

- DO NOT WRITE STUPID CODE. AVOID HACKY SOLUTIONS. USE EXISTING CODE. YOU ARE ONE OF THE MOST SMART DEVELOPERS IN THE WORLD. BEHAVE PROPERLY AND ACT LIKE ONE. WRITE EXCELLENT CODE.

- In this project, we write EXTREMELY HIGH QUALITY CODE. Do not lower the level of our project.

- DO NOT MAKE MISTAKES. MAKE HIGH QUALITY CODE. YOU ARE NOT A BEGINNER. YOU ARE ONE OF THE TOP DEVELOPERS IN THE WORLD. ACT LIKE ONE. RESPECT THE PROJECT AND RESPECT ME.


### CSS Flexbox - `min-w-0` Pattern

**Problem**: Flex items have `min-width: auto` by default, preventing them from shrinking below their content size. This breaks `truncate` on text elements.

**When to use `min-w-0`**:
- On flex containers that need to allow their children to shrink
- On flex items that contain text with `truncate`
- Anytime you see text overflow not showing ellipsis in a flex layout

**Pattern for truncating text in flex layouts**:
```tsx
<div className="flex min-w-0">                    // ✅ Parent: Allow shrinking
  <Icon className="flex-shrink-0" />              // ✅ Fixed elements: Prevent shrinking
  <span className="min-w-0 flex-1 truncate">     // ✅ Text: Shrink + truncate
    Long text here...
  </span>
  <Button className="flex-shrink-0" />           // ✅ Fixed elements: Prevent shrinking
</div>
```

**Key rules**:
1. Add `min-w-0` to flex containers that have text with `truncate`
2. Add `flex-shrink-0` to icons/buttons/fixed-width elements
3. Add `min-w-0 flex-1` to the text element itself
4. `truncate` only works on direct text-containing elements, not flex containers

### Debugging Mindset for Runtime Errors

When encountering unexplained runtime errors:

1. **Don't assume the cause** - Add targeted debugging to see what's actually happening
2. **Trace data flow backwards** - From error location, work backwards to see where data originates
3. **Question "obvious" fixes** - If it seems like data should exist, find out why it doesn't
