import os
from pathlib import Path
from typing import Optional


def visualize_directory(
    root_path: str,
    prefix: str = "",
    is_last: bool = True,
    exclude_dirs: Optional[set] = None,
) -> str:
    """
    Generate a tree-like visualization of the directory structure.
    Shows only first 2 CSV files in each directory and indicates if there are more.

    Args:
        root_path: Path to the directory to visualize
        prefix: Prefix for the current line (used for recursion)
        is_last: Boolean indicating if current item is last in its parent
        exclude_dirs: Set of directory names to exclude from visualization

    Returns:
        String representation of the directory tree
    """
    if exclude_dirs is None:
        exclude_dirs = {".git", "__pycache__", "node_modules", ".venv", "venv"}

    output = []
    root = Path(root_path)

    # Get the base name of the root directory
    if prefix == "":
        output.append(str(root) + "\n")
    else:
        output.append(prefix + ("└── " if is_last else "├── ") + root.name + "\n")

    # Get all items in the directory
    items = list(root.iterdir())
    items = sorted(items, key=lambda x: (not x.is_dir(), x.name.lower()))

    # Filter out excluded directories
    items = [item for item in items if item.name not in exclude_dirs]

    # Separate CSV files and other items
    csv_files = [
        item for item in items if item.is_file() and item.suffix.lower() == ".csv"
    ]
    other_items = [item for item in items if item not in csv_files]

    # Process non-CSV items first
    remaining_items = len(other_items)
    for index, item in enumerate(other_items):
        is_last_item = (index == remaining_items - 1) and (not csv_files)
        new_prefix = prefix + ("    " if is_last else "│   ")

        if item.is_dir():
            # Recursively process directories
            output.append(
                visualize_directory(str(item), new_prefix, is_last_item, exclude_dirs)
            )
        else:
            # Add non-CSV files
            output.append(
                new_prefix + ("└── " if is_last_item else "├── ") + item.name + "\n"
            )

    # Process CSV files
    if csv_files:
        new_prefix = prefix + ("    " if is_last else "│   ")
        # Show first 2 CSV files
        for i, csv_file in enumerate(csv_files[:2]):
            is_last_csv = (i == 1 or i == len(csv_files) - 1) and (len(csv_files) <= 2)
            output.append(
                new_prefix + ("└── " if is_last_csv else "├── ") + csv_file.name + "\n"
            )

        # If there are more CSV files, show indication
        if len(csv_files) > 2:
            output.append(
                new_prefix
                + "└── ... more CSVs ("
                + str(len(csv_files) - 2)
                + " more)\n"
            )

    return "".join(output)


def main():
    # Replace this with your directory path
    directory_path = r"C:\Users\KIIT\Desktop\Stock-Market-Dashboard"

    try:
        tree = visualize_directory(directory_path)
        print(tree)

        # Optionally save to a file
        with open("directory_tree.txt", "w", encoding="utf-8") as f:
            f.write(tree)
        print("\nTree structure has been saved to 'directory_tree.txt'")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
