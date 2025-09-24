1.  **computational inefficiencies**

- **getPriority** inside component

  - **Issue**: This function is redefined on every render

- **lhsPriority** is undefined =\> should use balancePriority

- **useMemo** dependencies

  - **prices** is in dependency array, but not used inside
    sortedBalances.

- **formattedBalances** is created but never used.

- **rows** uses **balance.formatted** but **sortedBalances** is not the
  formatted one. So balance.formatted is undefined.

2.  **Anti-pattern**:

- Missing return 0 for equal priorities =\> which can lead to **unstable
  sort**.

- key={index} Using **array index as key** can cause unnecessary
  re-renders.

- **WalletBalance** is missing **blockchain** property

- blockchain in **getPriority** is any type 
