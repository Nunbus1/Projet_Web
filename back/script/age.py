#!/usr/bin/python3
import argparse

def checkArguments():
    """Check program arguments and return program parameters."""
    parser = argparse.ArgumentParser()
    parser.add_argument('-m', '--model', type=str, required=True, help='model')
    parser.add_argument('-species', '--species', type=str, required=True, help='species')
    parser.add_argument('-height', '--height', type=int, required=True, help='height')
    parser.add_argument('-trunc_height', '--trunc_height', type=int, required=True, help='trunc_height')
    parser.add_argument('-trunc_diameter', '--trunc_diameter', type=int, required=True, help='trunc_diameter')
    parser.add_argument('-remarkable', '--remarkable', type=int, required=True, help='remarkable')
    parser.add_argument('-latitude', '--latitude', type=float, required=True, help='latitude')
    parser.add_argument('-longitude', '--longitude', type=float, required=True, help='longitude')
    parser.add_argument('-id_state', '--id_state', type=int, required=True, help='id_state')
    parser.add_argument('-id_stage', '--id_stage', type=int, required=True, help='id_stage')
    parser.add_argument('-id_habit', '--id_habit', type=int, required=True, help='id_habit')
    parser.add_argument('-id_base', '--id_base', type=int, required=True, help='id_base')
    return parser.parse_args()

# Main program.
args = checkArguments()
if args.model == 'knn':
    print(30)
elif args.model == 'svm':
    print(15)
elif args.model == 'rf':
    print(25)
elif args.model == 'mlp':
    print(23)
else:
    print(20)  # Default value
