import json
import sys

def split_sarif(input_file, max_runs):
    with open(input_file, 'r') as file:
        sarif = json.load(file)

    runs = sarif.get('runs', [])
    if len(runs) <= max_runs:
        return  # No splitting needed

    part1 = {'version': sarif['version'], '$schema': sarif['$schema'], 'runs': runs[:max_runs]}
    part2 = {'version': sarif['version'], '$schema': sarif['$schema'], 'runs': runs[max_runs:]}

    with open('results_part1.sarif', 'w') as file:
        json.dump(part1, file, indent=2)

    with open('results_part2.sarif', 'w') as file:
        json.dump(part2, file, indent=2)


if __name__ == '__main__':
    input_file = sys.argv[1]
    max_runs = int(sys.argv[2])
    split_sarif(input_file, max_runs)
