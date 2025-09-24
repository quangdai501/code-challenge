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

![](media/image1.png){width="3.0972222222222223in"
height="1.1666666666666667in"}

- key={index} Using **array index as key** can cause unnecessary
  re-renders.

- **WalletBalance** is missing **blockchain** property

- blockchain is any type

![](media/image2.png){width="3.0in" height="2.2916666666666665in"}
