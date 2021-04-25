import { applyTransform } from "love.graphics";

export default class Pathfinder {
    private start
    private tileMap
    private openNodes
    private gScores
    private fScores

    constructor(tileMap) {
        this.tileMap = tileMap;
    }

    public findPath(start, end): Object[] | null {
        this.start = start
        this.openNodes = {}
        let cameFrom = {}
        this.gScores = {}
        this.fScores = {}

        this.addOpenNode(start)
        this.setGScore(start, 0)
        this.setFScore(start, this.getDistance(start, end))

        while (Object.keys(this.openNodes).length !== 0 && this.openNodes.constructor === Object) {
            const currentNode = this.findBestOpenNode()

            if (this.areNodesEqual(currentNode, end)) {
                return this.reconstructPath(cameFrom, currentNode)
            }

            this.removeOpenNode(currentNode)
            const newGScore = this.getGScore(currentNode) + 1

            const neighbors = [
                {x: currentNode.x - 1, y: currentNode.y},
                {x: currentNode.x, y: currentNode.y - 1},
                {x: currentNode.x + 1, y: currentNode.y},
                {x: currentNode.x, y: currentNode.y + 1},
            ]

            neighbors.forEach((neighbor:any) => {
                if (
                    this.tileMap[neighbor.y] === undefined
                    || this.tileMap[neighbor.y][neighbor.x] === undefined
                    || this.tileMap[neighbor.y][neighbor.x] >= 1
                ) {
                    return
                }

                if (newGScore < this.getGScore(neighbor)) {
                    cameFrom[this.getKey(neighbor)] = {...currentNode}
                    this.setGScore(neighbor, newGScore)
                    this.setFScore(neighbor, newGScore + this.getDistance(neighbor, end))
                    this.addOpenNode(neighbor)
                }
            });
        }

        return null
    }

    private addOpenNode(node) {
        const key = this.getKey(node)

        if (!this.openNodes[key]) {
            this.openNodes[key] = {...node}
        }
    }

    private removeOpenNode(node) {
        this.openNodes[this.getKey(node)] = undefined
    }

    private findBestOpenNode() {
        let bestNode = null
        let bestScore = null

        Object.keys(this.openNodes).forEach((k) => {
            const node = this.openNodes[k]
            const score = this.getFScore(node)

            if (!bestScore || bestScore > score) {
                bestNode = node
                bestScore = score
            }
        })

        return bestNode
    }

    private reconstructPath(cameFrom, node:any): Object[] | null {
        let path = [node]

        while (!this.areNodesEqual(node, this.start)) {
            node = cameFrom[this.getKey(node)]
            path.push(node)
        }

        return path
    }

    private areNodesEqual(a, b) {
        return a.x === b.x && a.y === b.y
    }

    private setGScore(node, value) {
        this.gScores[this.getKey(node)] = value
    }

    private getGScore(node) {
        const key = this.getKey(node)
        const value = this.gScores[key]

        if (value === undefined) {
            this.gScores[key] = 99999999
            return 99999999
        }

        return value
    }

    private setFScore(node, value) {
        this.fScores[this.getKey(node)] = value
    }

    private getFScore(node) {
        const key = this.getKey(node)
        const value = this.fScores[key]

        if (value === undefined) {
            this.fScores[key] = 99999999
            return 99999999
        }

        return value
    }

    private getKey(node) {
        return node.x + "-" + node.y
    }

    private getDistance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }
}